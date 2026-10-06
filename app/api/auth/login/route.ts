
import { NextResponse } from "next/server";
import { flaskRequest } from "@/lib/flask";
import { validateOrigin } from "@/lib/security";
import { SESSION_COOKIE_NAME } from "@/lib/cookie_auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    if (!validateOrigin(request)) {
        return NextResponse.json(
            { message: "Invalid request origin." },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim()
                : "";

        const password =
            typeof body.password === "string"
                ? body.password
                : "";

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required." },
                { status: 400 }
            );
        }

        const { response, data } = await flaskRequest(
            "/auth/login",
            {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                data,
                { status: response.status }
            );
        }

        const result = data as {
            token?: string;
            user?: unknown;
            message?: string;
        };

        if (!result.token) {
            return NextResponse.json(
                { message: "Authentication response was invalid." },
                { status: 500 }
            );
        }

        const nextResponse = NextResponse.json({
            message: "Login successful.",
            user: result.user,
        });

        nextResponse.cookies.set({
            name: SESSION_COOKIE_NAME,
            value: result.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 12,
        });

        return nextResponse;

    } catch (error) {
        console.error("Login BFF error:", error);

        return NextResponse.json(
            { message: "Unable to complete login." },
            { status: 500 }
        );
    }
}
