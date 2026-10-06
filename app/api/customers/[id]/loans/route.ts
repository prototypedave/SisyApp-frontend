import { NextRequest, NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";

export async function GET( request: NextRequest, { params,}: { params: Promise<{ id: string }>; }) {
    try {
        const { id } = await params;

        const result = await flaskRequest( `/customer/loans/${encodeURIComponent(id)}`);

        return NextResponse.json(
            result.data,
            {
                status: result.response.status,
            }
        );
    } catch (error) {
        console.error(
            "GET /api/customers/[id]/loans failed:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Unable to connect to the backend.",
            },
            {
                status: 503,
            }
        );
    }
}