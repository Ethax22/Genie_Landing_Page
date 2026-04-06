import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, role, language, name, socialHandle } = body;

        // Validate required fields
        if (!email || !role || !language) {
            return NextResponse.json(
                { error: "Email, role, and language are required." },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await prisma.waitlistEntry.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json(
                {
                    error: "This email is already on the waitlist.",
                    queuePosition: existing.queuePosition,
                },
                { status: 409 }
            );
        }

        // Get current count for queue position
        const count = await prisma.waitlistEntry.count();
        const queuePosition = count + 1;

        // Create entry
        const entry = await prisma.waitlistEntry.create({
            data: {
                email,
                role,
                language,
                name: name || null,
                socialHandle: socialHandle || null,
                queuePosition,
            },
        });

        return NextResponse.json(
            { success: true, queuePosition: entry.queuePosition },
            { status: 201 }
        );
    } catch (error) {
        console.error("Waitlist API error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
