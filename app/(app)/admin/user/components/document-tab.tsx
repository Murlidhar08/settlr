"use client";

import { DocumentPreview } from "@/components/document-preview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getFileUrl } from "@/lib/utils";
import { useDeleteUserDocument, useRenameUserDocument, useUserDocuments } from "@/tanstacks/user";
import { Download, Eye, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentTabProps {
    userId: string;
}

export default function DocumentTab({ userId }: DocumentTabProps) {
    const [previewDoc, setPreviewDoc] = useState<any>(null);
    const [renameDoc, setRenameDoc] = useState<any>(null);
    const [newName, setNewName] = useState("");

    const { data: documents = [], isLoading } = useUserDocuments(userId);
    const deleteMutation = useDeleteUserDocument();
    const renameMutation = useRenameUserDocument();

    const handleRenameClick = (doc: any) => {
        setRenameDoc(doc);
        setNewName(doc.fileName);
    };

    const handleDownload = (doc: any) => {
        const link = document.createElement('a');
        link.href = getFileUrl(doc.documentRelativePath);
        link.download = doc.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDocumentType = (type: string) => {
        if (!type) return "Document";
        return type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground font-bold animate-pulse">Loading documents...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                    <FileText className="text-primary" />
                    Security Documents
                </h3>
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1 rounded-full">
                    {documents.length} Total
                </span>
            </div>

            {documents.length === 0 ? (
                <Card className="p-16 rounded-[3rem] border-2 border-dashed border-border/60 flex flex-col items-center justify-center bg-muted/5 transition-all hover:bg-muted/10">
                    <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
                        <FileText size={32} className="text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground font-black text-sm uppercase tracking-tighter">No documents uploaded</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc: any) => {
                        const isImage = !!doc.extension.match(/(jpg|jpeg|png|gif|webp)$/i);
                        const gradient = isImage
                            ? "from-pink-500 to-rose-500"
                            : doc.extension.toLowerCase() === "pdf"
                                ? "from-red-500 to-orange-500"
                                : "from-blue-500 to-indigo-500";
                        return (
                            <Card key={doc.id} className="rounded-[2.2rem] border border-border bg-card/60 backdrop-blur-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between p-5">
                                {/* Header Info */}
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex gap-4 items-center min-w-0">
                                        {isImage ? (
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted border border-border group-hover:scale-105 transition-transform duration-500 shrink-0 relative">
                                                <Image src={getFileUrl(doc.documentRelativePath)} alt={doc.fileName} fill unoptimized className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/5 group-hover:scale-105 transition-transform duration-500`}>
                                                <FileText size={24} className="text-white" />
                                            </div>
                                        )}

                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-black text-sm text-foreground truncate group-hover:text-primary transition-colors duration-300">
                                                    {doc.fileName}
                                                </h4>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                                                {formatDocumentType(doc.documentType)} • {doc.extension.replace(".", "")} File
                                            </p>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger render={
                                            <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-muted shrink-0">
                                                <MoreVertical size={16} />
                                            </Button>
                                        } />
                                        <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-40 shadow-2xl border-border bg-card">
                                            <DropdownMenuItem onClick={() => handleDownload(doc)} className="rounded-xl flex items-center gap-2 py-2.5 font-bold cursor-pointer">
                                                <Download size={16} /> Download
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRenameClick(doc)} className="rounded-xl flex items-center gap-2 py-2.5 font-bold cursor-pointer">
                                                <Pencil size={16} /> Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => deleteMutation.mutate({ documentId: doc.id, userId })}
                                                className="rounded-xl flex items-center gap-2 py-2.5 font-bold cursor-pointer focus:text-destructive focus:bg-destructive/10"
                                            >
                                                <Trash2 size={16} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/60">
                                    <Button
                                        variant="outline"
                                        className="rounded-xl h-9 text-xs font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary border-border"
                                        onClick={() => setPreviewDoc(doc)}
                                    >
                                        <Eye size={14} className="mr-2" /> Preview
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Premium Document Preview */}
            <DocumentPreview
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                url={previewDoc ? getFileUrl(previewDoc.documentRelativePath) : ""}
                fileName={previewDoc?.fileName || "document"}
                fileExtension={previewDoc?.extension}
            />

            {/* Rename Dialog */}
            <Dialog open={!!renameDoc} onOpenChange={(open) => !open && setRenameDoc(null)}>
                <DialogContent className="max-w-md p-8 rounded-[2rem] border-border bg-card shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Rename Document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Document Name</label>
                            <Input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="h-12 rounded-xl border-border bg-muted/20 font-bold px-4 focus:ring-primary"
                                placeholder="Enter new name..."
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setRenameDoc(null)}>Cancel</Button>
                            <Button
                                className="flex-1 rounded-xl h-12 font-black shadow-lg shadow-primary/20"
                                onClick={() => {
                                    renameMutation.mutate({ documentId: renameDoc.id, newName, userId }, {
                                        onSuccess: () => {
                                            toast.success("Document renamed successfully");
                                            setRenameDoc(null);
                                            setNewName("");
                                        }
                                    });
                                }}
                            >
                                {renameMutation.isPending ? "Renaming..." : "Save Name"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
