import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const { response, data } = await flaskRequest("/dashboard",
                {
                    method: "GET",
                    authenticated: true,
                }
            );
        return NextResponse.json(data,
            { status: response.status }
        );
    } catch (error) {
        console.error("Dashboard BFF error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Unable to load dashboard.",
            },
            { status: 500 }
        );
    }
}