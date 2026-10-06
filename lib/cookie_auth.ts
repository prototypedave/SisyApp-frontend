export const SESSION_COOKIE_NAME =
    process.env.NODE_ENV === "production"
        ? "__Host-sisyloan_session"
        : "sisyloan_session";