import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { getAbsolutePath } from "@/lib/file-operations";
import { getUserSession } from "@/lib/auth/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<any> }
) {
    const session = await getUserSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { path: pathSegments } = await params;
    const rawPath = pathSegments.join("/");

    // Normalize path (handle both / and \ just in case)
    const normalizedPath = rawPath.replace(/\\/g, "/");
    const absolutePath = getAbsolutePath(normalizedPath);

    if (!fs.existsSync(absolutePath)) {
        console.error(`[File API] File not found at ${absolutePath} (Requested: ${normalizedPath})`);
        return NextResponse.json({ error: "File not found", path: normalizedPath }, { status: 404 });
    }

    try {
        const fileBuffer = fs.readFileSync(absolutePath);
        const fileName = pathSegments[pathSegments.length - 1];
        const extension = fileName.split(".").pop()?.toLowerCase();

        const contentTypeMap: Record<string, string> = {
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            svg: "image/svg+xml",
            webp: "image/webp",
            pdf: "application/pdf",
            mp4: "video/mp4",
            webm: "video/webm",
            ogg: "video/ogg",
            txt: "text/plain",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            xls: "application/vnd.ms-excel",
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };

        const contentType = contentTypeMap[extension || ""] || "application/octet-stream";

        // To support secure serving, we allow inline for images/pdfs and attachment for others
        const isPreviewable = ["png", "jpg", "jpeg", "gif", "svg", "webp", "pdf", "mp4", "webm", "ogg"].includes(extension || "");
        const disposition = isPreviewable ? "inline" : "attachment";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(fileName)}`,
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("[File API] Error reading file:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
