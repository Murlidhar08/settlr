"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { userDocumentTypeItems } from "@/lib/constants/common";
import { useUploadUserDocument } from "@/tanstacks/user";
import { FileUp, RotateCw, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface DocumentUploadProps {
    userId: string;
}

export function DocumentUpload({ userId }: DocumentUploadProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState<string>("other");
    const uploadUserDocumentMutation = useUploadUserDocument();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const isValid = file.type.startsWith("image/") || file.type === "application/pdf";
            if (!isValid) {
                toast.error("Only Images and PDFs are allowed");
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select a file first");
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("documentType", documentType);

            await uploadUserDocumentMutation.mutateAsync({ userId, formData });
            toast.success("Document uploaded successfully");
            setSelectedFile(null);
            setDocumentType("other");
            if (fileInputRef.current) fileInputRef.current.value = "";
            router.refresh();
        } catch (error) {
            toast.error("Failed to upload document");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="p-8 rounded-[2rem] border-border bg-card shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-2">
                <FileUp size={18} className="text-primary" />
                Upload New Document
            </h4>

            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">Document Type</label>

                        <Select
                            items={userDocumentTypeItems}
                            value={documentType}
                            onValueChange={(val) => setDocumentType(val as string)}
                        >
                            <SelectTrigger className="w-35 h-10 rounded-xl border-2 font-bold focus:ring-primary/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl">
                                {userDocumentTypeItems.map((item) => (
                                    <SelectItem key={item.value} value={item.value} className="rounded-lg font-medium">
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">Select File</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="h-14 border border-dashed border-border/50 rounded-2xl flex items-center px-6 gap-3 cursor-pointer hover:bg-muted/30 transition-all hover:border-primary/50 group/upload"
                        >
                            <Upload size={18} className="text-muted-foreground group-hover/upload:text-primary transition-colors" />
                            <span className="text-sm font-bold text-muted-foreground group-hover/upload:text-foreground transition-colors truncate">
                                {selectedFile ? selectedFile.name : "Click to select file"}
                            </span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primary/20 transition-all"
                >
                    {isUploading ? <RotateCw className="animate-spin" size={18} /> : <Upload size={18} />}
                    {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
            </div>
        </Card>
    );
}
