"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { getCurrencySymbol } from "@/utility/transaction";
import { Currency } from "@/lib/generated/prisma/enums";
import { toast } from "sonner";
import { envClient } from "@/lib/env.client";

interface ExportPDFButtonProps {
    party: any;
    transactions: any[];
    totalIn: number;
    totalOut: number;
    balance: number;
    currency: Currency;
}

export default function ExportPDFButton({
    party,
    transactions,
    totalIn,
    totalOut,
    balance,
    currency
}: ExportPDFButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Dynamic import to avoid SSR issues and only load when needed
            const { default: jsPDF } = await import("jspdf");
            const { default: autoTable } = await import("jspdf-autotable");

            const doc = new jsPDF();
            const symbol = currency === Currency.INR ? "" : getCurrencySymbol(currency);

            // Branding
            doc.setFontSize(30);
            doc.setTextColor(59, 130, 246); // Brand Color
            doc.text(envClient.NEXT_PUBLIC_APP_NAME, 105, 20, { align: "center" });

            doc.setFontSize(14);
            doc.setTextColor(100);
            doc.text("ACCOUNT STATEMENT", 105, 28, { align: "center" });

            // Horizontal Line
            doc.setDrawColor(230, 230, 230);
            doc.line(14, 35, 196, 35);

            // Party Info
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("STATEMENT FOR:", 14, 45);
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.setFont("helvetica", "bold");
            doc.text(party.name.toUpperCase(), 14, 52);
            doc.setFont("helvetica", "normal");
            if (party.phone) doc.text(`Phone: ${party.phone}`, 14, 58);

            // Meta Info
            doc.setFontSize(10);
            doc.setTextColor(100);
            const dateStr = format(new Date(), "dd MMM, yyyy HH:mm");
            doc.text(`Generated on: ${dateStr}`, 196, 52, { align: "right" });
            doc.text(`Transactions: ${transactions.length}`, 196, 58, { align: "right" });

            // Summary Table
            autoTable(doc, {
                startY: 70,
                head: [['Summary Metrics', 'Amount']],
                body: [
                    ['Total Cash In (+)', `${symbol}${totalIn.toLocaleString()}`],
                    ['Total Cash Out (-)', `${symbol}${totalOut.toLocaleString()}`],
                    ['Closing Balance', `${balance < 0 ? '-' : ''}${symbol}${Math.abs(balance).toLocaleString()}`]
                ],
                theme: 'striped',
                headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
                columnStyles: { 1: { halign: 'left', fontStyle: 'bold' } },
                styles: { fontSize: 10, cellPadding: 5 },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 1) {
                        if (data.row.index === 0) data.cell.styles.textColor = [16, 128, 67]; // Green
                        if (data.row.index === 1) data.cell.styles.textColor = [185, 28, 28]; // Red
                        if (data.row.index === 2) data.cell.styles.textColor = balance >= 0 ? [16, 128, 67] : [185, 28, 28];
                    }
                }
            });

            // Transactions Table
            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 15,
                head: [['Date', 'Description', 'Mode', 'Type', 'Amount']],
                body: transactions.map((tx: any) => [
                    format(new Date(tx.date), "dd MMM, yyyy"),
                    tx.description || (tx.direction === "IN" ? "Payment Received" : "Payment Sent"),
                    tx.mode,
                    tx.direction === "IN" ? "Cash In" : "Cash Out",
                    `${tx.direction === "IN" ? "+" : "-"}${symbol}${tx.amount.toLocaleString()}`
                ]),
                headStyles: { fillColor: [44, 62, 80], fontStyle: 'bold' },
                bodyStyles: { textColor: [0, 0, 0] },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                columnStyles: { 4: { halign: 'left', fontStyle: 'bold', fontSize: 10 } },
                styles: { fontSize: 9, cellPadding: 3 },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 4) {
                        const amountText = data.cell.text[0];
                        if (amountText.startsWith('+')) {
                            data.cell.styles.textColor = [16, 128, 67]; // Green
                        } else if (amountText.startsWith('-')) {
                            data.cell.styles.textColor = [185, 28, 28]; // Red
                        }
                    }
                },
                didDrawPage: (data) => {
                    // Footer
                    const str = "Page " + (doc as any).internal.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
                    doc.text(`Secure Statement powered by ${envClient.NEXT_PUBLIC_APP_NAME} Business App`, 196, doc.internal.pageSize.height - 10, { align: "right" });
                }
            });



            doc.save(`${party.name}_Statement_${format(new Date(), "yyyy-MM-dd")}.pdf`);
            toast.success("Statement exported successfully!");
        } catch (error) {
            console.error("PDF Export failed:", error);
            toast.error("Failed to export PDF. Please check if jspdf is installed.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            className="gap-2 rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 lg:h-14"
        >
            {isExporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            {isExporting ? "Exporting..." : "Export PDF"}
        </Button>
    );
}
