import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const posts = await prisma.post.findMany();

    return NextResponse.json({
        success: true,
        message: "Hello from Next.js API!",
        data: posts
    });
}
