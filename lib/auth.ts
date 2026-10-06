import { flaskRequest } from "@/lib/flask";

export interface AuthenticatedUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_active: boolean;
    created_at: string | null;
    last_login_at: string | null;
}


export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
    const { response, data } = await flaskRequest("/auth/me",
        {
            method: "GET",
            authenticated: true,
        }
    );

    if (!response.ok) {
        return null;
    }

    const result = data as {
        user?: AuthenticatedUser;
    };

    return result.user ?? null;
}
