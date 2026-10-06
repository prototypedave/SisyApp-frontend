import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";
import { requireCsrf } from "@/lib/security";
import { SESSION_COOKIE_NAME } from "@/lib/cookie_auth";

export const dynamic = "force-dynamic";

export async function POST( request: Request ) {
    const csrfValid = await requireCsrf(request);
    if (!csrfValid) {
        return NextResponse.json(
            { message: "Invalid security token.", },
            { status: 403 }
        );
    }

    try {
        const { response, data } = await flaskRequest( "/auth/logout",
            {
                method: "POST",
                authenticated: true,
                csrfToken: request.headers.get("X-CSRF-Token") ?? undefined,
            }
        );

        const nextResponse =
            NextResponse.json(data,
                { status: response.status, }
            );
        if (response.ok || response.status === 401) {
            nextResponse.cookies.delete(SESSION_COOKIE_NAME);
        }
        return nextResponse;
    } catch (error) {
        console.error("Logout BFF error:", error);
        return NextResponse.json(
            { message: "Unable to logout." },
            { status: 500 }
        );
    }
}