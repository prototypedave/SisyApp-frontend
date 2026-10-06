"use client";

import { ChevronRight, Eye, } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { formatDate, formatKES, getMethodClasses, getMethodLabel, Payment } from "../Utils";

interface PaymentTableProps {
    search?: string;
    period?: string;
    paymentMethod?: string;
}

async function fetchPayments(): Promise<Payment[]> {
    const response = await fetch("/api/payments", {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch payments");
    }

    const data = await response.json();
    return Array.isArray(data)
        ? data
        : data.payments ?? [];
}

const getInitials = (name?: string) => {
    if (!name) { return "—"; }

    return name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};


export default function PaymentTable({ search = "", period = "all", paymentMethod = "all", }: PaymentTableProps) {
    const router = useRouter();
    const { data: payments = [], isLoading, error, } = useQuery<Payment[]>({
        queryKey: ["payments"],
        queryFn: fetchPayments,
        refetchOnWindowFocus: true,
    });

    const now = new Date();

    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const startOfWeek = new Date(startOfToday);

    const day = startOfWeek.getDay();

    const daysFromMonday =
        day === 0 ? 6 : day - 1;

    startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);

    const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const filteredPayments = payments.filter((payment) => {
        const searchValue = search.trim().toLowerCase();
            if (searchValue) {
                const clientName =
                    payment.client?.toLowerCase() ?? "";

                const paymentId =
                    String(payment.id ?? "").toLowerCase();

                const loanId =
                    String(payment.loan_id ?? "").toLowerCase();

                const mobile =
                    payment.mobile?.toLowerCase() ?? "";

                const matchesSearch = clientName.includes(searchValue) || paymentId.includes(searchValue) || loanId.includes(searchValue) || mobile.includes(searchValue);

                if (!matchesSearch) {
                    return false;
                }
            }

            if (paymentMethod !== "all") {
                const selectedMethod = getMethodLabel(payment.method).toLowerCase();

                if (selectedMethod !== paymentMethod.toLowerCase()) {
                    return false;
                }
            }

            if (period !== "all") {
                const paymentDate = new Date(`${payment.pay_date}T00:00:00`);

                if (Number.isNaN(paymentDate.getTime())) {
                    return false;
                }

                if (period === "today" && paymentDate.getTime() !== startOfToday.getTime()) {
                    return false;
                }

                if (period === "this-week" && paymentDate < startOfWeek) {
                    return false;
                }

                if (period === "this-month" && paymentDate < startOfMonth) {
                    return false;
                }
            }

            return true;
        }
    );

    const handleViewPayment = ( paymentId: string ) => {router.push(`/dashboard/payments/${paymentId}`);};

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5 lg:px-6">
                <div>
                    <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Payment Transactions</h2>
                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{filteredPayments.length.toLocaleString()}{" "} payment {filteredPayments.length === 1 ? "" : "s"} found</p>
                </div>
            </div>

            {isLoading && (
                <div className="divide-y divide-slate-100">
                    {Array.from({length: 6,}).map((_, index) => (
                        <div key={index} className="flex items-center justify-between px-4 py-4 sm:px-5 lg:px-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
                                <div className="space-y-2">
                                    <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="ml-auto h-4 w-24 animate-pulse rounded bg-slate-100" />
                                <div className="ml-auto h-3 w-16 animate-pulse rounded bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && error && (
                <div className="px-5 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">Unable to load payments</p>
                    <p className="mt-1 text-xs text-slate-500">Please try again shortly.</p>
                </div>
            )}

            {!isLoading && !error && filteredPayments.length === 0 && (
                <div className="px-5 py-12 text-center">
                     <p className="text-sm font-semibold text-slate-800">No payments found </p>
                     <p className="mt-1 text-xs text-slate-500">Try changing your search or filters.</p>
                </div>
            )}

            {!isLoading && !error && filteredPayments.length > 0 && (
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                <th className="px-5 py-3.5 lg:px-6">Payment</th>
                                    <th className="px-5 py-3.5">Customer</th>
                                    <th className="px-5 py-3.5">Loan</th>
                                    <th className="px-5 py-3.5">Amount</th>
                                    <th className="px-5 py-3.5">Date</th>
                                    <th className="px-5 py-3.5">Method</th>
                                    <th className="w-16 px-5 py-3.5" />
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map(
                                    (payment) => (
                                        <tr key={payment.id} onClick={() => handleViewPayment(String(payment.id))} className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50">
                                            <td className="px-5 py-4 lg:px-6">
                                                <p className="text-sm font-semibold text-slate-800">PAY{payment.id}</p>
                                                <p className="mt-0.5 text-xs text-slate-400">Transaction</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                                        {getInitials(payment.client)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-800">{payment.client || "Unknown customer"}</p>
                                                        {payment.mobile && (
                                                            <p className="mt-0.5 text-xs text-slate-400">{payment.mobile}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="text-sm font-medium text-blue-600">PAY{payment.loan_id}</span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold text-slate-900">{formatKES(payment.amount)}</p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm text-slate-600">{formatDate(payment.pay_date)}</p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getMethodClasses(payment.method)}`}>{getMethodLabel(payment.method)}</span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <button type="button" onClick={(event) => {event.stopPropagation();
                                                        handleViewPayment(String(payment.id)
                                                    );}}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={`View payment ${payment.id}`}
                                                >
                                                    <Eye size={17}/>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            
            {!isLoading && !error && filteredPayments.length > 0 && (
                <div className="divide-y divide-slate-100 md:hidden"> {filteredPayments.map((payment) => (
                    <button key={payment.id} type="button" onClick={() => handleViewPayment(String(payment.id))} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition active:bg-slate-50">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">{getInitials(payment.client)}</div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-800">{payment.client || "Unknown customer"}</p>
                                <p className="mt-0.5 text-sm font-semibold text-slate-900">{formatKES(payment.amount)}</p>
                                <p className="mt-1 truncate text-[11px] text-slate-400">PAY{payment.id}{" · "}Loan LN00{payment.loan_id}{" · "}{formatDate(payment.pay_date)}</p>
                            </div>
                        </div>
                         <div className="flex shrink-0 items-center gap-2">
                            <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${getMethodClasses(payment.method)}`}>{getMethodLabel(payment.method)}</span>
                            <ChevronRight size={16} className="text-slate-300"/>
                        </div>
                    </button>
                ))}
                </div>
            )}
        </section>
    );
}