import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";
import { requireCsrf } from "@/lib/security";

interface RouteContext { params: Promise<{id: string;}>; }
export const dynamic = "force-dynamic";

export async function GET( request: Request, context: RouteContext ) {
    const { id } = await context.params;
    try {
        const { response, data } = await flaskRequest(`/customers/${encodeURIComponent(id)}`,
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
        console.error("Customer GET BFF error:", error);
        return NextResponse.json(
            { message: "Unable to load customer." },
            { status: 500 }
        );
    }
}

export async function PATCH( request: Request, context: RouteContext ) {
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
        const { response, data } = await flaskRequest(`/customers/${encodeURIComponent(id)}`,
            {
                method: "PATCH",
                authenticated: true,
                csrfToken:
                    csrfToken ?? undefined,
                body: JSON.stringify(body),
            }
        );

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Customer PATCH BFF error:", error);
        return NextResponse.json(
            { message: "Unable to update customer." },
            { status: 500 }
        );
    }
}