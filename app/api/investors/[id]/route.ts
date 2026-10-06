import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";
import { requireCsrf } from "@/lib/security";

interface RouteContext { params: Promise<{id: string;}>; }
export const dynamic = "force-dynamic";

export async function GET( request: Request, context: RouteContext ) {
    const { id } = await context.params;
    try {
        const { response, data } = await flaskRequest(`/investors/${encodeURIComponent(Number(id))}`,
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
        console.error("Investor GET BFF error:", error);
        return NextResponse.json(
            { message: "Unable to load investor." },
            { status: 500 }
        );
    }
}