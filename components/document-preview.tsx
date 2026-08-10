"use client";

import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    Download,
    FileText,
    Printer,
    X
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
const MotionImage = motion.create(Image);

interface DocumentPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    fileName: string;
    fileExtension?: string;
}

export function DocumentPreview({
    isOpen,
    onClose,
    url,
    fileName,
    fileExtension
}: DocumentPreviewProps) {
    const [isLoading, setIsLoading] = useState(true);

    const fileUrl = getFileUrl(url);

    // Auto-detect extension if not provided
    const pathname = fileUrl.split('?')[0];
    const extension = (fileExtension || pathname.split('.').pop()?.toLowerCase() || "").replace(".", "");
    const isPDF = extension === "pdf";
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(extension) || fileUrl.includes("googleusercontent.com");

    useEffect(() => {
        setIsLoading(true);
        if (isOpen && !isPDF && !isImage) {
            setIsLoading(false);
        }
    }, [fileUrl, isOpen, isPDF, isImage]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        if (isPDF) {
            const printWindow = window.open(fileUrl, '_blank');
            if (printWindow) {
                printWindow.print();
            }
        } else if (isImage) {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write(`
                    <html>
                        <head>
                            <title>Print - ${fileName}</title>
                            <style>
                                body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; }
                                img { max-width: 100%; max-height: 100%; object-fit: contain; }
                                @page { margin: 0; }
                            </style>
                        </head>
                        <body>
                            <img src="${fileUrl}" onload="window.print();" />
                        </body>
                    </html>
                `);
                doc.close();

                iframe.onload = () => {
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 1000);
                };
            }
        } else {
            window.open(fileUrl, '_blank')?.print();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
            >
                {/* Backdrop Click to Close (only on the edges) */}
                <div className="absolute inset-0 -z-10" onClick={onClose} />
                <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
                    {!isPDF && (
                        <>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/10"
                                onClick={handlePrint}
                            >
                                <Printer size={20} />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/10"
                                onClick={handleDownload}
                            >
                                <Download size={20} />
                            </Button>
                        </>
                    )}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/10"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </Button>
                </div>


                {/* Main Preview Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full h-full max-w-7xl bg-[#1a1a1a] rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Content Area */}
                    <div className="flex-1 bg-[#121212] overflow-hidden flex items-center justify-center relative">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#121212]">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Loading Media</p>
                                </div>
                            </div>
                        )}

                        {isPDF ? (
                            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-white relative">
                                <iframe
                                    src={`${fileUrl}#view=FitH`}
                                    className="w-full h-full border-none"
                                    onLoad={() => setIsLoading(false)}
                                    title={fileName}
                                />
                            </div>
                        ) : isImage ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <MotionImage
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={fileUrl}
                                    alt={fileName}
                                    fill
                                    unoptimized
                                    className="object-contain rounded-xl shadow-2xl"
                                    onLoad={() => setIsLoading(false)}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-12 max-w-md">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
                                    <FileText size={48} className="text-white/20" />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                    No Visual Preview
                                </h4>
                                <p className="text-white/40 text-sm font-medium mb-8">
                                    The document format <strong className="text-primary">{extension}</strong> is not supported for direct preview. Please download to view.
                                </p>
                                <Button
                                    onClick={handleDownload}
                                    className="rounded-full h-14 px-10 font-black uppercase tracking-widest shadow-2xl shadow-primary/20"
                                >
                                    <Download className="mr-3" size={20} /> Download Now
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Footer Hint */}
                    <div className="h-10 bg-[#252525]/50 flex items-center justify-center px-6 shrink-0">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                            Secure Property Document Vault
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
