export interface ReportOverview {
    loans_issued: number;
    principal_issued: string;
    interest_expected: string;

    collections: string;
    principal_collected: string;
    interest_collected: string;

    outstanding: string;
    active_loans: number;
    completed_loans: number;

    overdue_loans: number;
    overdue_amount: string;

    total_customers: number;
    active_borrowers: number;

    investor_capital: string;
    investor_balance: string;
    investor_returns_paid: string;
}


export interface LoanReport {
    issued_count: number;
    principal_issued: string;
    interest_expected: string;
    average_loan: string;

    active_count: number;
    paid_count: number;

    overdue_count: number;
    overdue_balance: string;

    outstanding_balance: string;
}


export interface CollectionReport {
    payment_count: number;

    total_collected: string;
    principal_collected: string;
    interest_collected: string;

    outstanding: string;

    collection_rate: string;
}


export interface CustomerReport {
    total_customers: number;
    active_borrowers: number;
    customers_with_loans: number;
    completed_borrowers: number;
}


export interface InvestorReport {
    investor_count: number;
    active_investors: number;

    total_principal: string;
    outstanding_balance: string;
    total_due: string;

    returns_paid: string;
    principal_paid: string;
    total_paid: string;
}


export interface ReportsData {
    company: {
        id: number;
        name: string;
    };

    period: {
        from: string;
        to: string;
        previous_from: string;
        previous_to: string;
    };

    overview: ReportOverview;

    comparison: {
        previous: ReportOverview;
    };

    loans: LoanReport;

    collections: CollectionReport;

    customers: CustomerReport;

    investors: InvestorReport;
}


export interface ReportsResponse {
    success: boolean;
    data?: ReportsData;
    message?: string;
}


export async function fetchReports(
    from: string,
    to: string
): Promise<ReportsData> {

    const params =
        new URLSearchParams({
            from,
            to,
        });

    const response = await fetch(
        `/api/reports?${params.toString()}`,
        {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        }
    );

    const result = (await response.json()) as ReportsResponse;

    if (!response.ok || !result.success || !result.data) {
        throw new Error(
            result.message ??
            "Unable to load reports."
        );
    }

    return result.data;
}