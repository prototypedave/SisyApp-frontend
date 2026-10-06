import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";
import { requireCsrf } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET( request: Request ) {
    try {
        const url = new URL(request.url);
        const params = url.searchParams;
        const search = params.get("search") ?? "";
        const page = params.get("page") ?? "1";
        const perPage = params.get("per_page") ?? "20";
        const includeArchived = params.get("include_archived") ?? "false";
        const query = new URLSearchParams({
            search,
            page,
            per_page: perPage,
            include_archived:
                includeArchived,
        });

        const { response, data, } = await flaskRequest(`/customers?${query.toString()}`,
            {
                method: "GET",
                authenticated: true,
            }
        );

        return NextResponse.json(data,
            { status: response.status }
        );

    } catch (error) {
        console.error("Customers GET BFF error:", error);
        return NextResponse.json(
            { message: "Unable to load customers."},
            { status: 500 }
        );
    }
}

export async function POST( request: Request ) {
    const csrfValid = await requireCsrf(request);
    if (!csrfValid) {
        return NextResponse.json(
            { message: "Invalid security token.", },
            { status: 403, }
        );
    }

    try {
        const body = await request.json();
        const csrfToken = request.headers.get("X-CSRF-Token");
        const { response, data, } = await flaskRequest("/customers",
            {
                method: "POST",
                authenticated: true,
                csrfToken:
                    csrfToken ?? undefined,
                body: JSON.stringify(body),
            }
        );

        return NextResponse.json(data,
            { status: response.status }
        );

    } catch (error) {
        console.error("Customers POST BFF error:", error);
        return NextResponse.json(
            { message: "Unable to create customer."},
            { status: 500 }
        );
    }
}