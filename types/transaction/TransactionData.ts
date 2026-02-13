import { PaymentMode, TransactionDirection } from "@/types/enums";

export interface TransactionRes {
  id: string;
  amount: number;
  date: Date;
  mode: PaymentMode;
  direction: TransactionDirection;
  description: string | null;
  createdAt: Date;
}
