import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";
import { requireCsrf } from "@/lib/security";


export const dynamic = "force-dynamic";


export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const params = url.searchParams;
        const query = new URLSearchParams();

        query.set("page", params.get("page") ?? "1");
        query.set("per_page", params.get("per_page") ?? "20");

        if (params.get("status")) {
            query.set("status", params.get("status")!);
        }

        if (params.get("customer_id")) {
            query.set("customer_id", params.get("customer_id")!);
        }

        const { response, data } = await flaskRequest(`/loans?${query.toString()}`,
            {
                method: "GET",
                authenticated: true,
            }
        );

        return NextResponse.json(data,
            { status: response.status, }
        );

    } catch (error) {
        console.error("Loans GET BFF error:", error);
        return NextResponse.json(
            { message: "Unable to load loans." },
            { status: 500, }
        );
    }
}


export async function POST( request: Request ) {
    const csrfValid = await requireCsrf(request);
    if (!csrfValid) {
        return NextResponse.json(
            { message: "Invalid security token." },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const csrfToken = request.headers.get("X-CSRF-Token");
        const { response, data } = await flaskRequest("/loans",
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
        console.error("Loans POST BFF error:", error);
        return NextResponse.json(
            { message: "Unable to create loan." },
            { status: 500 }
        );
    }
}