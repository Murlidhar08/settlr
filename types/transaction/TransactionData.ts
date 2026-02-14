import { PaymentMode, TransactionDirection } from "@/lib/generated/prisma/client";

export interface TransactionRes {
  id: string;
  amount: number;
  date: Date;
  mode: PaymentMode;
  direction: TransactionDirection;
  description: string | null;
  createdAt: Date;
  fromAccount?: { name: string, type: string };
  toAccount?: { name: string, type: string };
  party?: { name: string };
}
