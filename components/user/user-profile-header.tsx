"use client";

import { DocumentPreview } from "@/components/document-preview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth/auth-client";
import { cn, getFileUrl } from "@/lib/utils";
import { useUploadProfileImage } from "@/tanstacks/user";
import { getInitials, getRoleBadgeColor } from "@/utility/common-function";
import { AtSign, Camera, Cog, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface UserProfileHeaderProps {
    user?: any;
    isEditing?: boolean;
}

export function UserProfileHeader({ user, isEditing = false }: UserProfileHeaderProps) {
    const router = useRouter();
    const { data: sessionData } = useSession();
    const currentUser = sessionData?.user;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const uploadProfileImageMutation = useUploadProfileImage();

    if (!user) {
        return (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="h-24 w-24 sm:h-28 sm:w-28 absolute -inset-1.5 bg-linear-to-tr from-indigo-500 to-primary rounded-full blur opacity-25" />
                        <Avatar className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-background shadow-2xl relative overflow-hidden">
                            <AvatarFallback className="rounded-full bg-primary/5 text-primary text-3xl font-black">
                                NU
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground">New User Profile</h1>
                            <Badge variant="outline" className="h-6 gap-1 px-2.5 rounded-full border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                                Creating
                            </Badge>
                        </div>
                        <p className="text-muted-foreground font-bold text-sm">Fill in user details to create a new profile</p>
                    </div>
                </div>
            </div>
        );
    }

    const canEdit = currentUser && (currentUser.id === user.id || currentUser.role === "admin");

    const handleAvatarClick = () => {
        if (!canEdit || isUploading) return;
        fileInputRef.current?.click();
    };

    const handleAvatarContainerClick = () => {
        if (!isEditing && user.image) {
            setIsPreviewOpen(true);
        } else if (canEdit) {
            handleAvatarClick();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await uploadProfileImageMutation.mutateAsync({ formData, userId: user.id });
            toast.success("Profile picture updated successfully!");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to upload profile picture.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border/50">
            <div className="flex items-center gap-6">
                <div
                    className={cn(
                        "relative group",
                        (canEdit || (!isEditing && user.image)) && !isUploading && "cursor-pointer"
                    )}
                    onClick={handleAvatarContainerClick}
                >
                    <div className="h-24 w-24 sm:h-28 sm:w-28 absolute -inset-1.5 bg-linear-to-tr from-indigo-500 to-primary rounded-full blur opacity-25 group-hover:opacity-45 transition duration-500" />
                    <Avatar className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-background shadow-2xl relative overflow-hidden">
                        <AvatarImage
                            src={getFileUrl(user.image)}
                            className="rounded-full object-cover"
                        />

                        <AvatarFallback className="rounded-full bg-primary/5 text-primary text-3xl font-black">
                            {getInitials(user.name)}
                        </AvatarFallback>

                        {/* Hover overlay for desktop */}
                        {canEdit && !isUploading && isEditing && (
                            <div
                                className="absolute inset-0 bg-black/50 flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAvatarClick();
                                }}
                            >
                                <Camera size={24} className="mb-1" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Change</span>
                            </div>
                        )}

                        {/* Uploading loading overlay */}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                                <Loader2 size={24} className="animate-spin text-primary" />
                            </div>
                        )}
                    </Avatar>

                    {/* Camera icon badge for mobile */}
                    {canEdit && !isUploading && isEditing && (
                        <div
                            className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-2xl shadow-lg border-2 border-background flex md:hidden items-center justify-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAvatarClick();
                            }}
                        >
                            <Camera size={14} />
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground">{user.name}</h1>
                        {isEditing && (
                            <Badge variant="outline" className="h-6 gap-1 px-2.5 rounded-full border-indigo-500/20 bg-indigo-500/5 text-indigo-500 text-[9px] font-black uppercase tracking-widest">
                                <Cog size={10} className="animate-spin duration-3000" />
                                Editing
                            </Badge>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground font-bold text-sm">
                        <span className="flex items-center gap-1.5 text-primary/80">
                            <AtSign size={14} />
                            {user.username || "N/A"}
                        </span>
                        <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-border" />
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {user.address || "Unknown Location"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
                {(user.roleTypes || []).map((role: any) => (
                    <Badge key={role} className={cn("border px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xs transition-all duration-300 hover:scale-105", getRoleBadgeColor(role))}>
                        {role}
                    </Badge>
                ))}
            </div>

            {/* Document Preview for Profile Picture */}
            {user.image && (
                <DocumentPreview
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                    url={getFileUrl(user.image)}
                    fileName={`${user.name}-profile-picture`}
                />
            )}
        </div>
    );
}
