import { apiFetch } from "../api";

export interface LoanCustomer {
    id: string;
    first_name: string;
    last_name: string;
    mobile: string;
}


export interface Loan {
    id: number;
    loan_number: string;
    customer_id: string;
    customer: LoanCustomer;
    company_id: number;
    principal: string;
    interest_rate: string;
    interest_amount: string;
    total_due: string;
    balance: string;
    loan_date: string;
    due_date: string;
    status: | "ACTIVE" | "PAID";
    completion_date: string | null;
    created_at: string | null;
}


export interface LoanResponse {
    loans: Loan[];
    pagination: {
        page: number;
        per_page: number;
        total: number;
        pages: number;
    };
}

export interface Payment {
    id: number;
    payment_number: string;
    loan_number: number;
    amount: string;
    payment_method: string;
    payment_date: string;
}

export interface PaymentResponse {
    payments: Payment[];
    pagination: {
        page: number;
        per_page: number;
        total: number;
        pages: number;
    }
}


async function getCsrfToken() {
    const response = await apiFetch("/api/auth/csrf", {cache: "no-store"});
    if (!response.ok) {
        throw new Error("Unable to obtain security token.");
    }

    const data = await response.json();
    return data.token as string;
}


export async function fetchLoans(status?: string, customer_id?: string): Promise<LoanResponse> {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("per_page", "50");
    if (status) { params.set("status", status); }
    if (customer_id) { params.set("customer_id", customer_id); }

    const response = await apiFetch(`/api/loans?${params.toString()}`, {cache: "no-store"});
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Unable to load loans.");
    }

    return data;
}

export async function fetchLoan( id: number ): Promise<Loan> {
    const response = await apiFetch(`/api/loans/${encodeURIComponent(id)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Unable to load loan.");
    }
    return data;
}


export async function createLoan(
    payload: {
        customer_id?: string;
        principal: string;
        interest_rate: string;
        due_date: string;
        loan_date?: string;
    }
) {
    const csrf = await getCsrfToken();
    const response =
        await apiFetch("/api/loans",
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
        throw new Error(data.message ?? "Unable to create loan.");
    }

    return data;
}


export async function recordPayment(
    loanId: number,
    payload: {
        amount: number;
        payment_date: string;
        payment_method: string;
        payment_number: string;
        reference?: string;
        notes?: string;
    }
) {
    const csrf = await getCsrfToken();
    const response = await apiFetch(`/api/loans/${loanId}/payments`,
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
        throw new Error(data.message ?? "Unable to record payment.");
    }

    return data;
}


export async function fetchPayments(loan_id?: number): Promise<PaymentResponse> {
    const params = new URLSearchParams();
    if (loan_id) { params.set("loan_id", String(loan_id)); }
    const response = await apiFetch(`/api/loans/${loan_id}/payments`, {cache: "no-store"});
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Unable to load payments.");
    }

    return data;
}