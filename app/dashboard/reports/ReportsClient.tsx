"use client";

import {
    AlertCircle,
    BarChart3,
    CalendarDays,
    ChevronRight,
    CircleDollarSign,
    CreditCard,
    Users,
    Wallet,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { fetchReports, type ReportsData } from "@/lib/api/reports";
import { formatKES, formatNumber } from "@/lib/dashboard-utils";
import { useMemo, useState } from "react";


type ReportTab = "overview" | "loans" | "collections" | "customers" | "investors";


function getDefaultDates() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return {
        from: `${year}-${month}-01`,
        to: `${year}-${month}-${day}`,
    };
}


export default function ReportsClient() {
    const defaults =
        useMemo(
            () => getDefaultDates(),
            []
        );

    const [
        from,
        setFrom,
    ] = useState(
        defaults.from
    );

    const [
        to,
        setTo,
    ] = useState(
        defaults.to
    );

    const [
        appliedFrom,
        setAppliedFrom,
    ] = useState(
        defaults.from
    );

    const [
        appliedTo,
        setAppliedTo,
    ] = useState(
        defaults.to
    );

    const [
        tab,
        setTab,
    ] = useState<ReportTab>(
        "overview"
    );


    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: [
            "reports",
            appliedFrom,
            appliedTo,
        ],

        queryFn: () =>
            fetchReports(
                appliedFrom,
                appliedTo
            ),

        staleTime: 60_000,

        refetchOnWindowFocus: false,
    });


    function applyDateRange() {
        if (!from || !to) {
            return;
        }

        if (from > to) {
            return;
        }

        setAppliedFrom(from);
        setAppliedTo(to);
    }


    return (
        <div className="space-y-6 pb-10">

            {/* Header */}

            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Reports</h1>
                <p className="mt-1 text-sm text-zinc-500">Understand your company's performance over time.</p>
            </div>


            {/* Date range */}

            <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <DateInput
                            label="From"
                            value={from}
                            onChange={setFrom}
                        />

                        <DateInput
                            label="To"
                            value={to}
                            onChange={setTo}
                        />

                    </div>

                    <button
                        type="button"
                        onClick={applyDateRange}
                        disabled={!from || !to || from > to}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CalendarDays size={16}/>
                        Generate report
                    </button>

                </div>

                <p className="mt-3 text-xs text-zinc-500">
                    Showing {appliedFrom} to {appliedTo}
                </p>

            </section>


            {/* Loading */}

            {isLoading && (
                <ReportsSkeleton />
            )}


            {/* Error */}

            {isError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="mt-0.5 text-red-600"/>
                        <div>
                            <h2 className="font-semibold text-red-900">Unable to load report</h2>
                            <p className="mt-1 text-sm text-red-700">
                                {error instanceof Error ? error.message : "Something went wrong."}</p>
                            <button type="button" onClick={() => refetch()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Report */}

            {data && !isLoading && (

                <>
                    <div className="overflow-x-auto">
                        <div className="flex min-w-max gap-1 rounded-xl border border-zinc-200 bg-zinc-100 p-1">
                            <ReportTabButton active={tab === "overview"} onClick={() => setTab("overview")}>
                                Overview
                            </ReportTabButton>

                            <ReportTabButton active={tab === "loans"} onClick={() => setTab("loans")}>
                                Loans
                            </ReportTabButton>

                            <ReportTabButton active={tab === "collections"} onClick={() => setTab("collections")}>
                                Collections
                            </ReportTabButton>
                            <ReportTabButton active={tab === "customers"} onClick={() => setTab("customers")}>
                                Customers
                            </ReportTabButton>
                            <ReportTabButton
                                active={tab === "investors"} onClick={() => setTab("investors")}>
                                Investors
                            </ReportTabButton>
                        </div>

                    </div>


                    {tab === "overview" && (
                        <OverviewReport
                            data={data}
                        />
                    )}

                    {tab === "loans" && (
                        <LoansReport
                            data={data}
                        />
                    )}

                    {tab === "collections" && (
                        <CollectionsReport
                            data={data}
                        />
                    )}

                    {tab === "customers" && (
                        <CustomersReport
                            data={data}
                        />
                    )}

                    {tab === "investors" && (
                        <InvestorsReport
                            data={data}
                        />
                    )}

                </>
            )}

        </div>
    );
}


function DateInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (
        value: string
    ) => void;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-600">{label}</span>
            <input
                type="date"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400"
            />
        </label>
    );
}


function ReportTabButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={["rounded-lg px-4 py-2 text-sm font-medium transition", active ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-900",].join(" ")}
        >
            {children}
        </button>
    );
}


function ReportCard({
    label,
    value,
    description,
    icon: Icon,
}: {
    label: string;
    value: string;
    description?: string;
    icon?: React.ElementType;
}) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-zinc-500">{label}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">{value}</p>
                    {description && (
                        <p className="mt-1 text-xs text-zinc-500">
                            {description}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100">
                        <Icon size={18} className="text-zinc-600"/>
                    </div>
                )}
            </div>
        </div>
    );
}


function SectionTitle({ title, description }: { title: string; description: string; }) {
    return (
        <div>
            <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
    );
}


function OverviewReport({ data }: { data: ReportsData; }) {
    const current = data.overview;
    const previous = data.comparison.previous;
    return (
        <div className="space-y-6">
            <SectionTitle
                title="Company overview"
                description="A high-level view of financial performance for the selected period."
            />
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <ReportCard
                    label="Principal issued"
                    value={formatKES(
                        current.principal_issued
                    )}
                    description={`${formatNumber(current.loans_issued)} loans`}
                    icon={ArrowUpIcon}
                />

                <ReportCard
                    label="Collected"
                    value={formatKES(
                        current.collections
                    )}
                    description={`${formatNumber(current.active_loans)} active loans`}
                    icon={ArrowDownIcon}
                />

                <ReportCard
                    label="Interest collected"
                    value={formatKES(
                        current.interest_collected
                    )}
                    description="Actual interest received"
                    icon={CircleDollarSign}
                />

                <ReportCard
                    label="Outstanding"
                    value={formatKES(
                        current.outstanding
                    )}
                    description={`${formatNumber(current.overdue_loans)} overdue`}
                    icon={Wallet}
                />

            </div>


            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                <ReportCard
                    label="Interest expected"
                    value={formatKES(
                        current.interest_expected
                    )}
                    description="From loans issued in period"
                />

                <ReportCard
                    label="Overdue"
                    value={formatKES(
                        current.overdue_amount
                    )}
                    description={`${formatNumber(current.overdue_loans)} loans`}
                />

                <ReportCard
                    label="Customers"
                    value={formatNumber(
                        current.total_customers
                    )}
                    description={`${formatNumber(current.active_borrowers)} active borrowers`}
                    icon={Users}
                />

                <ReportCard
                    label="Investor capital"
                    value={formatKES(
                        current.investor_capital
                    )}
                    description={`${formatKES(current.investor_balance)} outstanding`}
                    icon={Wallet}
                />

            </div>


            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ">
                <SectionTitle title="Period comparison" description="Current period compared with the immediately preceding period of equal length."/>
                <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                                <th className="pb-3 font-medium">Metric</th>
                                <th className="pb-3 font-medium">Current</th>
                                <th className="pb-3 font-medium">Previous</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100">

                            <ComparisonRow
                                label="Principal issued"
                                current={formatKES(current.principal_issued)}
                                previous={formatKES(previous.principal_issued)}
                            />

                            <ComparisonRow
                                label="Collections"
                                current={formatKES(current.collections)}
                                previous={formatKES(previous.collections)}
                            />

                            <ComparisonRow
                                label="Interest collected"
                                current={formatKES(current.interest_collected)}
                                previous={formatKES(previous.interest_collected)}
                            />

                            <ComparisonRow
                                label="Loans issued"
                                current={formatNumber(current.loans_issued)}
                                previous={formatNumber(previous.loans_issued)}
                            />

                        </tbody>

                    </table>

                </div>

            </section>

        </div>
    );
}


function ComparisonRow({
    label,
    current,
    previous,
}: {
    label: string;
    current: string;
    previous: string;
}) {
    return (
        <tr>

            <td className="py-3 font-medium text-zinc-800 ">
                {label}
            </td>

            <td className="py-3 text-zinc-950 ">
                {current}
            </td>

            <td className="py-3 text-zinc-500">
                {previous}
            </td>

        </tr>
    );
}


function LoansReport({
    data,
}: {
    data: ReportsData;
}) {
    const report =
        data.loans;

    return (
        <div className="space-y-6">

            <SectionTitle
                title="Loan performance"
                description="Issuance, portfolio status and outstanding exposure."
            />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                <ReportCard
                    label="Loans issued"
                    value={formatNumber(
                        report.issued_count
                    )}
                    description="During selected period"
                    icon={CreditCard}
                />

                <ReportCard
                    label="Principal issued"
                    value={formatKES(
                        report.principal_issued
                    )}
                    icon={ArrowUpIcon}
                />

                <ReportCard
                    label="Average loan"
                    value={formatKES(
                        report.average_loan
                    )}
                />

                <ReportCard
                    label="Interest expected"
                    value={formatKES(
                        report.interest_expected
                    )}
                />

            </div>


            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                <ReportCard
                    label="Active"
                    value={formatNumber(
                        report.active_count
                    )}
                />

                <ReportCard
                    label="Completed"
                    value={formatNumber(
                        report.paid_count
                    )}
                />

                <ReportCard
                    label="Overdue"
                    value={formatNumber(
                        report.overdue_count
                    )}
                    description={formatKES(report.overdue_balance)}
                />

                <ReportCard
                    label="Outstanding"
                    value={formatKES(
                        report.outstanding_balance
                    )}
                />

            </div>

        </div>
    );
}


function CollectionsReport({
    data,
}: {
    data: ReportsData;
}) {
    const report =
        data.collections;

    return (
        <div className="space-y-6">

            <SectionTitle
                title="Collections"
                description="Money actually received from customers during the selected period."
            />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                <ReportCard
                    label="Total collected"
                    value={formatKES(
                        report.total_collected
                    )}
                    icon={CircleDollarSign}
                />

                <ReportCard
                    label="Principal"
                    value={formatKES(
                        report.principal_collected
                    )}
                    description="Principal recovered"
                />

                <ReportCard
                    label="Interest"
                    value={formatKES(
                        report.interest_collected
                    )}
                    description="Interest earned"
                />

                <ReportCard
                    label="Payments"
                    value={formatNumber(
                        report.payment_count
                    )}
                    description="Transactions"
                />

            </div>


            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500">Collection rate</p>
                        <p className="mt-2 text-3xl font-bold text-zinc-950">{Number(report.collection_rate).toFixed(1)}%</p>
                        <p className="mt-1 text-xs text-zinc-500">Based on expected loan amounts and current outstanding balance</p>
                    </div>
                    <BarChart3 size={28} className="text-zinc-400"/>
                </div>
            </section>

        </div>
    );
}


function CustomersReport({
    data,
}: {
    data: ReportsData;
}) {
    const report =
        data.customers;

    return (
        <div className="space-y-6">

            <SectionTitle
                title="Customer performance"
                description="Borrower activity across the company portfolio."
            />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                <ReportCard
                    label="Customers"
                    value={formatNumber(
                        report.total_customers
                    )}
                    icon={Users}
                />

                <ReportCard
                    label="Active borrowers"
                    value={formatNumber(
                        report.active_borrowers
                    )}
                    description="Currently have active loans"
                />

                <ReportCard
                    label="Borrowers"
                    value={formatNumber(
                        report.customers_with_loans
                    )}
                    description="Have borrowed from company"
                />

                <ReportCard
                    label="Completed"
                    value={formatNumber(
                        report.completed_borrowers
                    )}
                    description="Have completed loans"
                />

            </div>

        </div>
    );
}


function InvestorsReport({
    data,
}: {
    data: ReportsData;
}) {
    const report =
        data.investors;

    return (
        <div className="space-y-6">

            <SectionTitle
                title="Investor performance"
                description="Capital supplied by investors and investor obligations."
            />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                <ReportCard
                    label="Investors"
                    value={formatNumber(
                        report.investor_count
                    )}
                    icon={Users}
                />

                <ReportCard
                    label="Active investors"
                    value={formatNumber(
                        report.active_investors
                    )}
                />

                <ReportCard
                    label="Investor capital"
                    value={formatKES(
                        report.total_principal
                    )}
                    icon={Wallet}
                />

                <ReportCard
                    label="Outstanding"
                    value={formatKES(
                        report.outstanding_balance
                    )}
                />

            </div>


            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                <ReportCard
                    label="Total due"
                    value={formatKES(
                        report.total_due
                    )}
                    description="Active investor obligations"
                />

                <ReportCard
                    label="Returns paid"
                    value={formatKES(
                        report.returns_paid
                    )}
                    description="Selected period"
                />

                <ReportCard
                    label="Principal paid"
                    value={formatKES(
                        report.principal_paid
                    )}
                    description="Selected period"
                />

                <ReportCard
                    label="Total paid"
                    value={formatKES(
                        report.total_paid
                    )}
                    description="Investor payments"
                />

            </div>


            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                        <Wallet size={19} className="text-zinc-600 "/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-zinc-950 ">Investor capital position</h3>
                        <p className="mt-1 text-sm leading-6 text-zinc-500">
                            The company currently has{" "}
                            <strong className="text-zinc-800">
                                {formatKES( report.outstanding_balance )}
                            </strong>{" "}
                            remaining in active investor obligations.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}


function ArrowUpIcon() {
    return (
        <ChevronRight
            size={18}
            className="rotate-[-45deg]"
        />
    );
}


function ArrowDownIcon() {
    return (
        <ChevronRight
            size={18}
            className="rotate-[45deg]"
        />
    );
}


function ReportsSkeleton() {
    return (
        <div className="animate-pulse space-y-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {Array.from({ length: 4,
                }).map((_, index) => (
                    <div key={index} className="h-28 rounded-2xl bg-zinc-200"/>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {Array.from({ length: 4,
                }).map((_, index) => (
                    <div key={index} className="h-28 rounded-2xl bg-zinc-200"/>
                ))}
            </div>
            <div className="h-56 rounded-2xl bg-zinc-200" />

        </div>
    );
}