
export const SESSION_COOKIE_NAME =
    process.env.APP_ORIGIN?.startsWith("https://")
        ? "__Host-sisyloan_session"
        : "sisyloan_session";

