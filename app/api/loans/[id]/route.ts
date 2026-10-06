import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";
import { requireCsrf } from "@/lib/security";

interface RouteContext { params: Promise<{id: number;}>; }
export const dynamic = "force-dynamic";

export async function GET( request: Request, context: RouteContext ) {
    const { id } = await context.params;
    try {
        const { response, data } = await flaskRequest(`/loans/${encodeURIComponent(id)}`,
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
        console.error("Loan GET BFF error:", error);
        return NextResponse.json(
            { message: "Unable to load loan." },
            { status: 500 }
        );
    }
}