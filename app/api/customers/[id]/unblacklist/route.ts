import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";
import { requireCsrf } from "@/lib/security";

interface RouteContext { params: Promise<{ id: string; }>; }
export const dynamic = "force-dynamic";

export async function POST( request: Request, context: RouteContext ) {
    const csrfValid = await requireCsrf(request);
    if (!csrfValid) {
        return NextResponse.json(
            { message: "Invalid security token." },
            { status: 403 }
        );
    }
    const { id } = await context.params;
    try {
        const body = await request.json();
        const csrfToken = request.headers.get("X-CSRF-Token");
        const { response, data, } = await flaskRequest(`/customers/${encodeURIComponent(id)}/unblacklist`,
            {
                method: "POST",
                authenticated: true,
                csrfToken: csrfToken ?? undefined,
                body: JSON.stringify(body),
            }
        );

        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error("Customer unblacklist BFF error:", error);
        return NextResponse.json(
            { message: "Unable to unblacklist customer." },
            { status: 500 }
        );
    }
}