import { NextResponse } from "next/server";

import { flaskRequest } from "@/lib/flask";
import { requireCsrf } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function PUT(
    request: Request
) {
    const csrfValid =
        await requireCsrf(request);

    if (!csrfValid) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid security token.",
            },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();

        const { response, data } =
            await flaskRequest(
                "/settings/password",
                {
                    method: "PUT",
                    authenticated: true,
                    csrfToken:
                        request.headers.get(
                            "X-CSRF-Token"
                        ) ?? undefined,
                    body: JSON.stringify(body),
                }
            );

        const nextResponse =
            NextResponse.json(data, {
                status: response.status,
            });

        return nextResponse;
    } catch (error) {
        console.error(
            "Password settings BFF error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to change password.",
            },
            { status: 500 }
        );
    }
}