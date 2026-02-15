import { PaymentMode } from "@/lib/generated/prisma/client";

export interface TransactionRes {
  id: string;
  amount: number;
  date: Date;
  mode: PaymentMode;
  description: string | null;
  createdAt: Date;
  fromAccountId: string;
  toAccountId: string;
  fromAccount?: { name: string, type: string };
  toAccount?: { name: string, type: string };
  party?: { name: string };
}
