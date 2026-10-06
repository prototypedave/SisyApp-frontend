import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/cookie_auth";

const CSRF_COOKIE = "__Host-sisyloan_csrf";

function getAppOrigin(): string {
    return ( process.env.APP_ORIGIN ?? "http://localhost:3000" );
}

export function validateOrigin( request: Request ): boolean {
    const origin = request.headers.get("origin");
    if (!origin) {
        return false;
    }
    return origin === getAppOrigin();
}


export function generateCsrfToken( sessionToken: string ): string {
    const nonce = randomBytes(32).toString("hex");
    const secret = process.env.CSRF_SECRET;
    if (!secret) {
        throw new Error("CSRF_SECRET is not configured.");
    }

    const payload = `${sessionToken}.${nonce}`;
    const signature = createHmac("sha256", secret).update(payload).digest("hex");
    return `${nonce}.${signature}`;
}


export function verifyCsrfToken( token: string, sessionToken: string ): boolean {
    const secret = process.env.CSRF_SECRET;
    if (!secret || !token || !sessionToken) {
        return false;
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
        return false;
    }

    const [ nonce, suppliedSignature ] = parts;
    if (!nonce || !suppliedSignature) {
        return false;
    }

    const payload = `${sessionToken}.${nonce}`;
    const expectedSignature = createHmac("sha256", secret).update(payload).digest("hex");

    try {
        return timingSafeEqual(
            Buffer.from(suppliedSignature, "hex"),
            Buffer.from(expectedSignature, "hex")
        );

    } catch {
        return false;
    }
}


export async function getSessionToken() {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}


export async function requireCsrf( request: Request ): Promise<boolean> {
    if (!validateOrigin(request)) {
        return false;
    }

    const sessionToken = await getSessionToken();
    if (!sessionToken) {
        return false;
    }

    const csrfToken = request.headers.get("X-CSRF-Token");
    if (!csrfToken) {
        return false;
    }

    return verifyCsrfToken(csrfToken, sessionToken);
}


export { CSRF_COOKIE };