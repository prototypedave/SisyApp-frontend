import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const from = url.searchParams.get("from");
        const to = url.searchParams.get("to");

        const params = new URLSearchParams();

        if (from) {
            params.set("from", from);
        }

        if (to) {
            params.set("to", to);
        }

        const path = params.toString() ? `/reports?${params.toString()}` : "/reports";
        const {response, data} = await flaskRequest(path,
            {
                method: "GET",
                authenticated: true,
            }
        );

        return NextResponse.json(
            data,
            {
                status: response.status,
            }
        );

    } catch (error) {
        console.error("Reports BFF error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Unable to load reports.",
            },
            { status: 500 }
        );
    }
}