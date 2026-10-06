import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";
import { requireCsrf } from "@/lib/security";

interface RouteContext { params: Promise<{id: number;}>; }
export const dynamic = "force-dynamic";

export async function GET( request: Request, context: RouteContext ) {
    const { id } = await context.params;
    try {
        const { response, data } = await flaskRequest(`/loans/${encodeURIComponent(id)}/payments`,
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
        console.error("Loan payments GET BFF error:", error);
        return NextResponse.json(
            { message: "Unable to load payments." },
            { status: 500 }
        );
    }
}

export async function POST( request: Request, context: RouteContext ) {
    const csrfValid = await requireCsrf(request);
    const { id } = await context.params;
    if (!csrfValid) {
        return NextResponse.json(
            { message: "Invalid security token." },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const csrfToken = request.headers.get("X-CSRF-Token");
        const { response, data } = await flaskRequest(`/loans/${encodeURIComponent(id)}/payments`,
            {
                method: "POST",
                authenticated: true,
                csrfToken: csrfToken ?? undefined,
                body: JSON.stringify(body),
            }
        );

        return NextResponse.json(data,
            { status: response.status }
        );

    } catch (error) {
        console.error("Loan payments POST BFF error:", error);
        return NextResponse.json(
            { message: "Unable to record loan." },
            { status: 500 }
        );
    }
}