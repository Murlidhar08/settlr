"use server";

import { auth, getUserSession } from "@/lib/auth/auth";
import { deleteDirectory, deleteFile, uploadFile } from "@/lib/file-operations";
import { UserRole, UserStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma/prisma";
import { headers } from "next/headers";

export async function getCurrentUser() {
    const session = await getUserSession();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            contactNo: true,
            role: true,
            createdAt: true,
            username: true,
        }
    });

    return user;
}

export async function getDeviceSessions() {
    const session = await getUserSession();
    if (!session?.user?.id) return null;

    return await auth.api.listDeviceSessions({
        headers: await headers()
    });
}

export async function setActiveSession(sessionToken: string) {
    return await auth.api.setActiveSession({
        body: { sessionToken },
        headers: await headers(),
    });
}

export async function revokeSession(sessionToken: string) {
    return await auth.api.revokeDeviceSession({
        body: { sessionToken },
        headers: await headers(),
    });
}

export async function uploadProfileImage(formData: FormData, userId?: string) {
    const session = await getUserSession();
    const targetUserId = userId || session?.user?.id;
    if (!targetUserId) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    // 1. Find existing user to identify the old image path
    const user = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { image: true }
    });

    // 2. Delete existing file if it's a local storage file
    if (user?.image && !user.image.startsWith("http")) {
        // Clear prefix if migration required, and remove query params for fs check
        const oldRelativePath = user.image.replace("/api/files/", "").split("?")[0];
        try {
            await deleteFile(oldRelativePath);
        } catch (e) {
            console.error("Failed to delete old profile image:", e);
        }
    }

    // 3. Prepare deterministic filename: [targetUserId].[extension]
    const ext = file.name.split(".").pop() || "png";
    const fileName = `${targetUserId}.${ext}`;

    // 4. Upload to 'profile' root folder
    const relativePath = await uploadFile(file, "profile", fileName);
    // Add version parameter to the relative path
    const dbPath = `${relativePath}?v=${Date.now()}`;

    // 5. Update user image in Database
    await prisma.user.update({
        where: { id: targetUserId },
        data: { image: dbPath }
    });

    return { filePath: dbPath };
}

export async function updateUserStatus(userId: string, status: string) {
    return prisma.user.update({
        where: { id: userId },
        data: { status: status as any }
    });
}

export async function updateUserRole(userId: string, role: string) {
    const session = await getUserSession();
    if (!session) throw new Error("Unauthorized");

    return await prisma.user.update({
        where: { id: userId },
        data: {
            role: role === "admin" ? "admin" : "user"
        }
    });
}

export async function getUsersByType(type: string) {
    return prisma.user.findMany({
        where: {
            role: (type === "admin" || type === "user") ? type : undefined
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            contactNo: true,
            createdAt: true,
            occupation: true,
            address: true
        }
    });
}

// Get list of Clients (including admins)
export async function getClients() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            contactNo: true,
            createdAt: true,
            occupation: true,
            address: true
        }
    });
}

// Get List of Agents (including admins)
export async function getAgents() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            contactNo: true,
            occupation: true
        }
    });
}

// Get List of Owners (including admins)
export async function getOwners() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            contactNo: true
        }
    });
}

export async function getUserById(userId: string) {
    const session = await getUserSession();
    if (!session) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            accounts: {
                select: {
                    providerId: true
                }
            }
        }
    });

    if (!user) return null;

    return {
        ...user,
        banned: user.banned ?? false,
        banReason: user.banReason ?? null,
        roleTypes: [user.role || "user"],
    };
}

export async function removeUserRole(userId: string, roleToRemove: string) {
    const session = await getUserSession();
    if (!session) throw new Error("Unauthorized");

    await prisma.account.deleteMany({ where: { userId } });
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    return { success: true, deletedUser: true };
}

export async function deleteUser(userId: string) {
    const session = await getUserSession();
    if (!session) throw new Error("Unauthorized");

    // 1. Fetch user image and documents to delete physical files
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            image: true,
            userDocuments: {
                select: { documentRelativePath: true }
            }
        }
    });

    if (user) {
        // Delete profile image file if stored locally
        if (user.image && !user.image.startsWith("http")) {
            const oldRelativePath = user.image.replace("/api/files/", "").split("?")[0];
            try {
                await deleteFile(oldRelativePath);
            } catch (e) {
                console.error("Failed to delete user profile image during deleteUser:", e);
            }
        }

        // Delete document files stored locally
        if (user.userDocuments && user.userDocuments.length > 0) {
            for (const doc of user.userDocuments) {
                const docRelativePath = doc.documentRelativePath.replace("/api/files/", "").split("?")[0];
                try {
                    await deleteFile(docRelativePath);
                } catch (e) {
                    console.error("Failed to delete user document file during deleteUser:", e);
                }
            }
        }

        // Delete entire user document folder (document/${userId})
        try {
            await deleteDirectory(`document/${userId}`);
        } catch (e) {
            console.error("Failed to delete user document folder during deleteUser:", e);
        }
    }

    // 2. Delete database records in transaction
    return await prisma.$transaction(async (tx) => {
        await tx.userDocument.deleteMany({ where: { userId } });
        await tx.account.deleteMany({ where: { userId } });
        await tx.session.deleteMany({ where: { userId } });
        return tx.user.delete({
            where: { id: userId }
        });
    });
}

export async function createUser(data: any) {
    const session = await getUserSession();

    const {
        name,
        email,
        contactNo,
        username,
        status,
        occupation,
        address,
        description,
        role,
        roles
    } = data;

    const userRole = role || (Array.isArray(roles) && roles.includes("admin") ? "admin" : "user");

    const user = await prisma.user.create({
        data: {
            name,
            email: email || null,
            contactNo: contactNo || null,
            username: username || null,
            status: status || UserStatus.pendingapproval,
            occupation: occupation || null,
            address: address || null,
            description: description || null,
            role: userRole as UserRole || UserRole.user
        }
    });

    return user;
}

export async function updateUser(id: string, data: any) {
    const session = await getUserSession();

    const {
        name,
        email,
        contactNo,
        username,
        status,
        occupation,
        address,
        description,
        role,
        roles
    } = data;

    const userRole = role || (Array.isArray(roles) && roles.includes("admin") ? "admin" : "user");

    const user = await prisma.user.update({
        where: { id },
        data: {
            name,
            email: email || null,
            contactNo: contactNo || null,
            username: username || null,
            status: status || UserStatus.pendingapproval,
            occupation: occupation || null,
            address: address || null,
            description: description || null,
            role: userRole || "user"
        }
    });

    return user;
}

export async function checkUsernameUnique(username: string, excludeUserId?: string) {
    const user = await prisma.user.findFirst({
        where: {
            username,
            id: excludeUserId ? { not: excludeUserId } : undefined
        }
    });
    return !user;
}

export async function uploadUserDocument(userId: string, formData: FormData) {
    const session = await getUserSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;
    if (!file) throw new Error("No file uploaded");

    const ext = `.${file.name.split(".").pop() || ""}`.toLowerCase();
    const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1000)}${ext}`;

    const relativePath = await uploadFile(file, `document/${userId}`, uniqueName);

    return prisma.userDocument.create({
        data: {
            userId,
            fileName: file.name,
            extension: ext,
            documentRelativePath: relativePath,
            documentType: documentType as any,
            createdBy: session.user.id
        }
    });
}

export async function deleteUserDocument(documentId: string) {
    const session = await getUserSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const doc = await prisma.userDocument.findUnique({
        where: { id: documentId }
    });

    if (!doc) throw new Error("Document not found");

    const relativePath = doc.documentRelativePath.replace("/api/files/", "");
    try {
        await deleteFile(relativePath);
    } catch (e) {
        console.error("Failed to delete physical file:", e);
    }

    return prisma.userDocument.delete({
        where: { id: documentId }
    });
}

export async function getUserDocuments(userId: string) {
    return prisma.userDocument.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    });
}

export async function renameUserDocument(documentId: string, newName: string) {
    const doc = await prisma.userDocument.findUnique({
        where: { id: documentId }
    });

    return prisma.userDocument.update({
        where: { id: documentId },
        data: { fileName: newName }
    });
}

export async function getAllUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            contactNo: true,
            createdAt: true,
            occupation: true,
            address: true,
            role: true
        }
    });
}

export async function removeUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { image: true }
    });

    if (!user) return false;

    if (user.image && !user.image.startsWith("http")) {
        const oldRelativePath = user.image.replace("/api/files/", "").split("?")[0];
        try {
            await deleteFile(oldRelativePath);
        } catch (e) {
            console.error("Failed to delete old profile image:", e);
        }
    }

    await prisma.user.update({
        where: { id: userId },
        data: { image: null }
    });

    return true;
}
