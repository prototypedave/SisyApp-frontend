import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";

export async function GET() {
    try {
        const { response, data } = await flaskRequest("/auth/me",
            {
                method: "GET",
                authenticated: true,
            }
        );

        return NextResponse.json(data,
            {
                status: response.status,
            }
        );

    } catch (error) {
        console.error("Auth me BFF error:", error);

        return NextResponse.json(
            {
                message: "Unable to verify authentication.",
            },
            {
                status: 500,
            }
        );
    }
}