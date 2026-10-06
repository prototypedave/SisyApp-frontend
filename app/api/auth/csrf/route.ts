import { NextResponse } from "next/server";
import { generateCsrfToken, getSessionToken } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET() {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
        return NextResponse.json(
            { message: "Authentication required." },
            { status: 401 }
        );
    }

    const token = generateCsrfToken(sessionToken);
    return NextResponse.json({token});
}