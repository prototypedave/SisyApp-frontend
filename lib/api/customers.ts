import { apiFetch } from "../api";

export interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    gender: string | null;
    mobile: string;
    other_mobile: string | null;
    email: string | null;
    salary: string | null;
    notes: string | null;
    requests: number;
    loan_limit: string;
    record: boolean;
    blacklisted: boolean;
    blacklisted_at: string | null;
    blacklist_reason: string | null;
    archived: boolean;
    archived_at: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface CustomerResponse {
    customers: Customer[];
    pagination: {
        page: number;
        per_page: number;
        total: number;
        pages: number;
    };
}

export interface CustomerActions {
    reason: string;
}


async function getCsrfToken() {
    const response = await apiFetch("/api/auth/csrf", { cache: "no-store" });
    if (!response.ok) {
        throw new Error("Unable to obtain security token.");
    }

    const data = await response.json();
    return data.token as string;
}


export async function fetchCustomers( search = "", page = 1 ): Promise<CustomerResponse> {
    const params =new URLSearchParams({search,
            page: String(page),
            per_page: "20",
        });

    const response = await apiFetch(`/api/customers?${params.toString()}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Unable to load customers.");
    }

    return data;
}


export async function fetchCustomer( id: string ): Promise<Customer> {

    const response = await apiFetch(`/api/customers/${encodeURIComponent(id)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Unable to load customers.");
    }
    return data;
}


export async function createCustomer( payload: Partial<Customer> ) {
    const csrf = await getCsrfToken();
    const response = await apiFetch("/api/customers",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrf,
                },
                body: JSON.stringify(payload),
            }
        );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Unable to create customer.");
    }

    return data;
}


export async function updateCustomer( id: string, payload: Partial<Customer> ) {
    const csrf = await getCsrfToken();
    const response = await apiFetch( `/api/customers/${encodeURIComponent(id)}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrf,
                },
                body: JSON.stringify(payload),
            }
        );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Unable to update customer.");
    }

    return data;
}


export async function archiveCustomer( id: string ) {
    const csrf = await getCsrfToken();
    const response =
        await apiFetch(`/api/customers/${encodeURIComponent(id)}/archive`,
            {
                method: "POST",
                headers: { "X-CSRF-Token": csrf, },
            }
        );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Unable to archive customer.");
    }

    return data;
}

export async function blacklistCustomer( id: string, payload: CustomerActions ) {
    const csrf = await getCsrfToken();
    const response =
        await apiFetch(`/api/customers/${encodeURIComponent(id)}/blacklist`,
            {
                method: "POST",
                headers: { "X-CSRF-Token": csrf, },
                body: JSON.stringify(payload),
            }
        );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Unable to archive customer.");
    }

    return data;
}


export async function UnblacklistCustomer( id: string ) {
    const csrf = await getCsrfToken();
    const response =
        await apiFetch(`/api/customers/${encodeURIComponent(id)}/unblacklist`,
            {
                method: "POST",
                headers: { "X-CSRF-Token": csrf, },
                body: JSON.stringify("")
            }
        );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Unable to archive customer.");
    }

    return data;
}