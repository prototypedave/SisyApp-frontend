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
        const csrfToken = request.headers.get("X-CSRF-Token");
        const { response, data } = await flaskRequest(`/customers/${encodeURIComponent(id)}/archive`,
            {
                method: "POST",
                authenticated: true,
                csrfToken: csrfToken ?? undefined,
            }
        );

        return NextResponse.json(data,
            { status: response.status }
        );

    } catch (error) {
        console.error("Customer archive BFF error:", error);
        return NextResponse.json(
            { message: "Unable to archive customer." },
            { status: 500 }
        );
    }
}