"use client";

import { Card } from "@/components/ui/card";
import { useUserDocuments } from "@/tanstacks/user";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, RotateCw } from "lucide-react";
import { DocumentCard } from "./document-card";

interface DocumentListProps {
    userId: string;
    isEditable?: boolean;
    documents?: any[];
}

export function DocumentList({ userId, isEditable = false, documents: initialDocuments }: DocumentListProps) {
    const { data: fetchedDocuments = [], isLoading: isFetching } = useUserDocuments(userId);

    const documents = initialDocuments || fetchedDocuments;
    const isLoading = !initialDocuments && isFetching;

    const hasDocuments = documents.length > 0;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20 bg-muted/10 rounded-[4rem] border-2 border-dashed border-border/40 animate-pulse transition-all">
                <div className="flex flex-col items-center gap-6 text-muted-foreground/50">
                    <div className="h-16 w-16 rounded-[2rem] bg-muted/50 flex items-center justify-center animate-spin">
                        <RotateCw size={32} className="text-primary/50" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Scanning Secure Vault...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm transition-transform hover:scale-105 duration-500">
                        <FileText size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tighter uppercase leading-none">Security Documents</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-1.5 ml-0.5">Sensitive User Verification Records</p>
                    </div>
                </div>
                {hasDocuments && (
                    <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] bg-muted px-4 py-2 rounded-full border border-border/50 shadow-xs">
                            {documents.length} Records Found
                        </span>
                    </div>
                )}
            </div>

            {!hasDocuments ? (
                <Card className="p-20 rounded-[4rem] border-2 border-dashed border-border/60 flex flex-col items-center justify-center bg-muted/5 transition-all duration-700 hover:bg-muted/10 group cursor-default">
                    <div className="h-24 w-24 rounded-[3rem] bg-muted border border-border/50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-xl shadow-black/5">
                        <FileText size={48} className="text-muted-foreground/20 group-hover:text-primary/20 transition-colors duration-700" />
                    </div>
                    <h5 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-3 group-hover:text-foreground/40 transition-colors duration-700 text-center">No documents in vault</h5>
                    <p className="text-[10px] font-bold text-muted-foreground/20 text-center min-w-50 leading-relaxed">
                        {isEditable ? "Upload essential verification documents to start securing this profile" : "Verification records for this profile are currently unavailable"}
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {documents.map((doc, idx) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 35,
                                    delay: idx * 0.05
                                }}
                            >
                                <DocumentCard document={doc} isEditable={isEditable} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
