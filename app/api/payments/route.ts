import { NextRequest, NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";

export async function GET() {
    try {
        const result = await flaskRequest("/payments");
        return NextResponse.json(
            result.data,
            {
                status: result.response.status,
            }
        );

    } catch (error) {

        console.error(
            "GET /api/customers/summary failed:",
            error
        );

        return NextResponse.json(
            {
                message: "Unable to connect to the backend.",
            },
            {
                status: 503,
            }
        );
    }
}


export async function POST( request: NextRequest ) {
    try {
        const body = await request.json();
        const result = await flaskRequest(
            "/loan-payment",
            {
                method: "POST",
                body: JSON.stringify(body),
            }
        );

        return NextResponse.json(
            result.data,
            {
                status: result.response.status,
            }
        );
    } catch (error) {
        console.error( "POST /api/loans failed:", error );

        return NextResponse.json(
            {
                message: "Unable to connect to the backend.",
            },
            {
                status: 503,
            }
        );
    }
}