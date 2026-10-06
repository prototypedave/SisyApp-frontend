import { apiFetch } from "../api";

export interface DashboardCustomer {
    id: string | null;
    first_name: string | null;
    last_name: string | null;
}

export interface DashboardActivity {
    type: "LOAN" | "PAYMENT";
    id: number;
    created_at: string | null;
    amount: string;
    status?: string;
    payment_method?: string;
    reference?: string | null;
    loan_id?: number;
    customer: DashboardCustomer;
}

export interface DashboardData {
    company: {
        id: number;
        name: string;
    };

    financial: {
        available_funds: string;
        initial_funds: string;
        outstanding: string;
        overdue_amount: string;
        due_today_amount: string;
        collected_this_month: string;
        principal_collected_this_month: string;
        interest_collected_this_month: string;
        loans_issued_this_month: string;
    };

    loans: {
        active: number;
        overdue: number;
        due_today: number;
        issued_this_month: number;
    };

    customers: {
        total: number;
        active_borrowers: number;
    };

    activity: DashboardActivity[];

    attention: {
        overdue_loans: number;
        due_today_loans: number;
    };

    period: {
        today: string;
        month_start: string;
        month_end: string;
    };
}

export interface DashboardResponse {
    success: boolean;
    data?: DashboardData;
    message?: string;
}


export async function fetchDashboard(): Promise<DashboardData> {
    const response = await apiFetch("/api/dashboard",
        {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        }
    );

    const result = (await response.json()) as DashboardResponse;
    if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message ?? "Unable to load dashboard.");
    }

    return result.data;
}