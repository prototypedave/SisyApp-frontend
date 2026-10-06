import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./cookie_auth";

interface FlaskRequestOptions extends RequestInit {
    authenticated?: boolean;
    csrfToken?: string;
}

export async function flaskRequest(path: string, options: FlaskRequestOptions = {}) {
    const apiUrl = process.env.FLASK_API_URL;
    const internalApiKey = process.env.FLASK_INTERNAL_API_KEY;

    if (!apiUrl) {
        throw new Error("FLASK_API_URL is not configured.");
    }

    if (!internalApiKey) {
        throw new Error("FLASK_INTERNAL_API_KEY is not configured.");
    }

    const { authenticated = false, csrfToken, ...fetchOptions } = options;
    const headers = new Headers(fetchOptions.headers);
    headers.set("Content-Type", "application/json");
    headers.set("X-Internal-API-Key", internalApiKey);

    if (authenticated) {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
        if (!sessionToken) {
            return {
                response: new Response(JSON.stringify({
                            message: "Authentication required.",
                        }),
                        {
                            status: 401,
                            headers: {"Content-Type": "application/json"},
                        }
                    ),
                data: {
                    message: "Authentication required.",
                },
            };
        }

        headers.set("Authorization", `Bearer ${sessionToken}`);
    }

    if (csrfToken) {
        headers.set("X-CSRF-Token", csrfToken);
    }

    const response = await fetch(`${apiUrl}${path}`,
            {...fetchOptions, headers, cache: "no-store",}
        );

    let data: unknown = null;
    try {
        data = await response.json();
    } catch {
        data = {
            message: "Backend returned an invalid response.",
        };
    }

    return { response, data };
}
