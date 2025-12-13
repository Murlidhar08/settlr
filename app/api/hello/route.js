import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const users = await prisma.User.findMany();

    return NextResponse.json({
        success: true,
        message: "Hello from Next.js API!",
        data: users
    });
}
