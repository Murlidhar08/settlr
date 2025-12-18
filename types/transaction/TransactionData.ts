import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/client";

export interface TransactionData {
    id: number;
    businessId: number;
    createdAt?: Date;
    updatedAt?: Date;
    amount: number;
    mode: PaymentMode;
    direction: TransactionDirection;
    date: Date;
    description: string | null;
    userId: number;
    partyId: number | null;
}