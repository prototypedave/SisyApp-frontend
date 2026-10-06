"use client";

import {
    AlertCircle,
    ArrowDownLeft,
    ArrowUpRight,
    CalendarClock,
    ChevronRight,
    CircleDollarSign,
    Clock3,
    CreditCard,
    Users,
    Wallet,
} from "lucide-react";

import { useQuery,} from "@tanstack/react-query";
import { fetchDashboard } from "@/lib/api/dashboard";
import { formatKES, formatNumber, formatRelativeTime, getCustomerName } from "@/lib/dashboard-utils";


function MetricCard({ label, value, icon: Icon, description }: {
    label: string;
    value: string;
    icon: React.ElementType;
    description?: string;
}) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-zinc-500 ">{label}</p>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">{value}</p>
                    {description && (
                        <p className="mt-1 text-xs text-zinc-500">{description}</p>
                    )}
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
}

export default function DashboardClient() {
    const { data, isLoading, isError, error, refetch } = useQuery({queryKey: ["dashboard"],
        queryFn: fetchDashboard,
        staleTime: 30_000,
        refetchInterval: 60_000,
        refetchOnWindowFocus: true,
    });

    if (isLoading) {
        return (
            <DashboardSkeleton />
        );
    }

    if (isError || !data) {
        return (
            <div className="space-y-6">
                <DashboardHeader />
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600"/>
                        <div>
                            <h2 className="font-semibold text-red-900">Unable to load dashboard</h2>
                            <p className="mt-1 text-sm text-red-700">{error instanceof Error ? error.message : "Something went wrong."}</p>
                            <button type="button" onClick={() => refetch()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            <DashboardHeader />
            <section>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-zinc-500">Available funds</p>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">{formatKES(data.financial.available_funds)}</p>
                            <p className="mt-2 text-sm text-zinc-500">Money currently available for lending</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                            <Wallet size={21} className="text-zinc-700"/>
                        </div>
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <MetricCard label="Outstanding" value={formatKES(data.financial.outstanding)} icon={CircleDollarSign}
                    description="Active loan balances"
                />
                <MetricCard label="Collected" value={formatKES(data.financial.collected_this_month)} icon={ArrowDownLeft}
                    description="This month"
                />
                <MetricCard label="Loans issued" value={formatKES(data.financial.loans_issued_this_month)} icon={ArrowUpRight}
                    description="This month"
                />
                <MetricCard label="Customers" value={formatNumber(data.customers.total)} icon={Users}
                    description={`${formatNumber(data.customers.active_borrowers)} active borrowers`}
                />
            </section>
            <section>
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-zinc-950">Loan portfolio</h2>
                        <p className="text-sm text-zinc-500">Current lending activity</p>
                    </div>
                    <a href="/dashboard/loans" className="flex items-center gap-1 text-sm font-medium text-zinc-700 hover:text-zinc-950">
                        View loans
                        <ChevronRight size={16} />
                    </a>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <StatusCard label="Active" value={data.loans.active} icon={CreditCard}/>
                    <StatusCard label="Due today" value={data.loans.due_today} icon={CalendarClock} urgent={data.loans.due_today > 0}/>
                    <StatusCard label="Overdue" value={data.loans.overdue} icon={Clock3} urgent={ data.loans.overdue > 0}/>
                </div>
            </section>

            {(data.attention.overdue_loans > 0 ||
                data.attention.due_today_loans > 0) && (
                <section>
                    <div className="mb-3">
                        <h2 className="text-base font-semibold text-zinc-950">Attention required</h2>
                        <p className="text-sm text-zinc-500">Items that may need action</p>
                    </div>
                    <div className="space-y-3">
                        {data.attention.overdue_loans > 0 && (
                            <AttentionItem
                                title={`${data.attention.overdue_loans} overdue ${data.attention.overdue_loans === 1 ? "loan" : "loans"}`}
                                description={formatKES(data.financial.overdue_amount)}
                                href="/dashboard/loans?status=OVERDUE" danger
                            />
                        )}
                        {data.attention.due_today_loans > 0 && (
                            <AttentionItem
                                title={`${data.attention.due_today_loans} ${data.attention.due_today_loans === 1 ? "loan is" : "loans are"} due today`}
                                description={formatKES(data.financial.due_today_amount)}
                                href="/dashboard/loans?status=DUE_TODAY"
                            />
                        )}
                    </div>
                </section>
            )}

            <section>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-500">Collections this month</p>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">{formatKES(data.financial.collected_this_month)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-zinc-500">Principal</p>
                            <p className="text-sm font-semibold text-zinc-800">{formatKES(data.financial.principal_collected_this_month)}</p>
                            <p className="mt-2 text-xs text-zinc-500">Interest</p>
                            <p className="text-sm font-semibold text-zinc-800">{formatKES(data.financial.interest_collected_this_month)}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-zinc-950">Recent activity</h2>
                        <p className="text-sm text-zinc-500">Latest loans and payments</p>
                    </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    {data.activity.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                            <p className="text-sm text-zinc-500">No recent activity.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100">
                            {data.activity.map(
                                (activity) => {const customerName = getCustomerName(activity.customer);
                                    const isPayment = activity.type ==="PAYMENT";
                                    return (
                                        <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-3 px-4 py-4">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-700">
                                                {isPayment ? (
                                                    <ArrowDownLeft size={17}/>
                                                ) : (
                                                    <ArrowUpRight size={17}/>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-zinc-900">
                                                    {isPayment ? `${customerName} made a payment` : `${customerName} received a loan`}
                                                </p>
                                                <p className="mt-0.5 text-xs text-zinc-500">
                                                    {formatRelativeTime(activity.created_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-zinc-900">
                                                    {formatKES(activity.amount)}
                                                </p>

                                                {isPayment &&
                                                    activity.payment_method && (
                                                        <p className="mt-0.5 text-xs text-zinc-500">{ activity.payment_method }</p>
                                                    )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}


function DashboardHeader() {
    return (
        <header>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">Your company's current financial position.</p>
        </header>
    );
}


function StatusCard({ label, value, icon: Icon, urgent = false }: {
    label: string;
    value: number;
    icon: React.ElementType;
    urgent?: boolean;
}) {
    return (
        <div className={["rounded-2xl border bg-white p-4 shadow-sm", urgent ? "border-amber-200 " : "border-zinc-200",].join(" ")}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-zinc-500">{label}</p>
                    <p className={["mt-1 text-xl font-bold", urgent ? "text-amber-700" : "text-zinc-950"].join(" ")}>{formatNumber(value)}</p>
                </div>
                <Icon size={18} className={urgent ? "text-red-600" : "text-blue-400"}/>
            </div>
        </div>
    );
}


function AttentionItem({ title, description, href, danger = false }: {
    title: string;
    description: string;
    href: string;
    danger?: boolean;
}) {
    return (
        <a href={href} className={["flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition hover:bg-zinc-50 ", danger ? "border-red-200 " : "border-amber-200 "].join(" ")}>
            <div className={["flex h-9 w-9 shrink-0 items-center justify-center rounded-full", danger ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"].join(" ")}>
                <AlertCircle size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900">{title}</p>
                <p className="mt-1 text-xs text-zinc-500">Outstanding: {description}</p>
            </div>
            <ChevronRight size={18} className="shrink-0 text-zinc-400"/>
        </a>
    );
}


function DashboardSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div>
                <div className="h-7 w-32 rounded bg-zinc-200" />
                <div className="mt-2 h-4 w-64 rounded bg-zinc-200" />
            </div>
            <div className="h-32 rounded-2xl bg-zinc-200" />
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {Array.from({length: 4}).map((_, index) => (
                    <div key={index} className="h-28 rounded-2xl bg-zinc-200"/>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
                {Array.from({length: 3}).map((_, index) => (
                    <div key={index} className="h-24 rounded-2xl bg-zinc-200 "/>
                ))}
            </div>
            <div className="h-64 rounded-2xl bg-zinc-200" />
        </div>
    );
}