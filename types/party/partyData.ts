import { PartyType } from "@/lib/generated/prisma/client";

export interface partyData {
    id?: number;
    businessId: number;
    name: string;
    type: PartyType;
    contactNo?: string;
    profileUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}