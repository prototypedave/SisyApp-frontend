import { NextResponse } from "next/server";

import { flaskRequest } from "@/lib/flask";
import { requireCsrf } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const { response, data } =
            await flaskRequest(
                "/settings/funds",
                {
                    method: "GET",
                    authenticated: true,
                }
            );

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error(
            "Fund history BFF error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to load fund history.",
            },
            { status: 500 }
        );
    }
}

export async function POST(
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
                "/settings/funds",
                {
                    method: "POST",
                    authenticated: true,
                    csrfToken:
                        request.headers.get(
                            "X-CSRF-Token"
                        ) ?? undefined,
                    body: JSON.stringify(body),
                }
            );

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error(
            "Fund adjustment BFF error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to update company funds.",
            },
            { status: 500 }
        );
    }
}