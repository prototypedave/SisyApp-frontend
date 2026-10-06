export interface CompanySettings {
    company: {
        id: number;
        name: string;
        initial_amount: string;
        current_amount: string;
    };

    settings: {
        currency: string;
        default_interest_rate: string;
        minimum_loan_amount: string;
        maximum_loan_amount: string | null;
        loan_grace_days: number;
        allow_partial_payments: boolean;
    };
}

export interface SettingsResponse {
    success: boolean;
    message?: string;
    data?: CompanySettings;
}

export interface FundAdjustment {
    id: number;
    company_id: number;
    user_id: string;

    user: {
        id: string;
        first_name: string;
        last_name: string;
    } | null;

    adjustment_type: "ADD" | "REMOVE";

    amount: string;
    balance_before: string;
    balance_after: string;

    reason: string;

    created_at: string | null;
}


async function getCsrfToken(): Promise<string> {
    const response = await fetch(
        "/api/auth/csrf",
        {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        }
    );

    const data = await response.json();

    if (!response.ok || !data.token) {
        throw new Error(
            data.message ||
            "Unable to obtain security token."
        );
    }

    return data.token;
}


export async function fetchSettings() {
    const response = await fetch(
        "/api/settings",
        {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        }
    );

    const data: SettingsResponse =
        await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message ||
            "Unable to load settings."
        );
    }

    return data.data!;
}


export async function updateBusiness(
    name: string
) {
    const csrfToken =
        await getCsrfToken();

    const response = await fetch(
        "/api/settings/business",
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type":
                    "application/json",
                "X-CSRF-Token":
                    csrfToken,
            },
            body: JSON.stringify({
                name,
            }),
        }
    );

    const data: SettingsResponse =
        await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message ||
            "Unable to update business."
        );
    }

    return data.data!;
}


export async function updateOperations(
    payload: {
        currency?: string;
        default_interest_rate?: string;
        minimum_loan_amount?: string;
        maximum_loan_amount?: string | null;
        loan_grace_days?: number;
        allow_partial_payments?: boolean;
    }
) {
    const csrfToken =
        await getCsrfToken();

    const response = await fetch(
        "/api/settings/operations",
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type":
                    "application/json",
                "X-CSRF-Token":
                    csrfToken,
            },
            body: JSON.stringify(
                payload
            ),
        }
    );

    const data: SettingsResponse =
        await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message ||
            "Unable to update settings."
        );
    }

    return data.data!;
}


export async function changePassword(
    payload: {
        current_password: string;
        new_password: string;
        confirm_password: string;
    }
) {
    const csrfToken =
        await getCsrfToken();

    const response = await fetch(
        "/api/settings/password",
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type":
                    "application/json",
                "X-CSRF-Token":
                    csrfToken,
            },
            body: JSON.stringify(
                payload
            ),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message ||
            "Unable to change password."
        );
    }

    return data;
}


export async function adjustFunds(
    payload: {
        adjustment_type: "ADD" | "REMOVE";
        amount: string;
        reason: string;
    }
) {
    const csrfToken =
        await getCsrfToken();

    const response = await fetch(
        "/api/settings/funds",
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type":
                    "application/json",
                "X-CSRF-Token":
                    csrfToken,
            },
            body: JSON.stringify(
                payload
            ),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message ||
            "Unable to update company funds."
        );
    }

    return data;
}


export async function fetchFundHistory() {
    const response = await fetch(
        "/api/settings/funds",
        {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message ||
            "Unable to load fund history."
        );
    }

    return data.data as FundAdjustment[];
}