"use client";

import {
    ChevronRight,
    Eye,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loan } from "../Utils";


interface LoanTableProps {
    title: string;
    search?: string;
    status?: string;
    dueDate?: string;
}

async function fetchLoans(): Promise<Loan[]> {
    const response = await fetch("/api/loans", { cache: "no-store", });

    if (!response.ok) {
        throw new Error("Failed to fetch loans");
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.loans ?? [];
}

const formatKES = (value: string | number) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) {
        return "KES 0";
    }

    return `KES ${amount.toLocaleString("en-KE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
};

const formatDate = (value?: string) => {
    if (!value) {
        return "—";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-KE", {day: "2-digit", month: "short", year: "numeric",});
};

const getInitials = (name?: string) => {
    if (!name) {
        return "—";
    }

    return name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const getStatusClasses = (status: Loan["status"]) => {
    switch (status) {
        case "Current":
            return {
                badge: "border-green-100 bg-green-50 text-green-700",
                avatar: "bg-green-100 text-green-700",
            };

        case "Due Today":
            return {
                badge: "border-amber-100 bg-amber-50 text-amber-700",
                avatar: "bg-amber-100 text-amber-700",
            };

        case "Due Soon":
            return {
                badge: "border-blue-100 bg-blue-50 text-blue-700",
                avatar: "bg-blue-100 text-blue-700",
            };

        case "Overdue":
            return {
                badge: "border-red-100 bg-red-50 text-red-700",
                avatar: "bg-red-100 text-red-700",
            };

        case "Completed":
            return {
                badge: "border-slate-200 bg-slate-50 text-slate-600",
                avatar: "bg-slate-100 text-slate-600",
            };

        default:
            return {
                badge: "border-slate-200 bg-slate-50 text-slate-600",
                avatar: "bg-slate-100 text-slate-600",
            };
    }
};

export default function LoanTable({ title, search = "", status = "all", dueDate = "all", }: LoanTableProps) {
    const router = useRouter();
    const { data: loans = [], isLoading,  error, } = useQuery<Loan[]>({
        queryKey: ["loans"],
        queryFn: fetchLoans,
        refetchOnWindowFocus: true,
    });

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrow = new Date(startOfToday);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sevenDaysFromNow = new Date(startOfToday);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const filteredLoans = loans.filter(
        (loan) => {
            const searchValue = search.trim().toLowerCase();
            if (searchValue) {
                const clientName =loan.client?.toLowerCase() ?? "";
                const loanId = String(loan.id).toLowerCase();

                const mobile =
                    loan.mobile?.toLowerCase() ?? "";
                const matchesSearch = clientName.includes(searchValue) || loanId.includes(searchValue) || mobile.includes(searchValue);

                if (!matchesSearch) {
                    return false;
                }
            }

            if (status !== "all") {
                if (status === "active" && loan.status !== "Current") { return false; }
                if (status === "due-today" && loan.status !== "Due Today") { return false; }
                if (status === "due-soon" && loan.status !== "Due Soon") { return false;}
                if (status === "overdue" && loan.status !== "Overdue") { return false; }
                if (status === "completed" && loan.status !== "Completed") { return false; }
            }

            if (dueDate !== "all") {
                const loanDate = new Date(`${loan.pay_date}T00:00:00`);
                if (Number.isNaN(loanDate.getTime())) { return false; }
                if (dueDate === "today" && loanDate.getTime() !== startOfToday.getTime()) { return false; }
                if (dueDate === "tomorrow" && loanDate.getTime() !== tomorrow.getTime()) { return false;}
                if (dueDate === "next-7-days" && (loanDate < startOfToday || loanDate > sevenDaysFromNow)) { return false; }
                if (dueDate === "this-month") {
                    if (loanDate.getMonth() !== startOfToday.getMonth() || loanDate.getFullYear() !== startOfToday.getFullYear()) { return false; }
                }
            }

            return true;
        }
    );

    const handleViewLoan = (loanId: string) => {
        router.push(`/dashboard/loans/${loanId}`);
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5 lg:px-6">
                <div>
                    <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h2>
                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{filteredLoans.length.toLocaleString()}{" "}loan{filteredLoans.length === 1 ? "" : "s"} found</p>
                </div>
            </div>

            {isLoading && (
                <div className="divide-y divide-slate-100">
                    {Array.from({length: 6,}).map((_, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5 lg:px-6">
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
                    <p className="text-sm font-medium text-slate-700">Unable to load loans</p>
                    <p className="mt-1 text-xs text-slate-500">Please try again shortly.</p>
                </div>
            )}

            {!isLoading && !error && filteredLoans.length === 0 && (
                <div className="px-5 py-12 text-center">
                    <p className="text-sm font-semibold text-slate-800">No loans found</p>
                    <p className="mt-1 text-xs text-slate-500">Try changing your search or filters.</p>
                </div>
            )}

            {!isLoading && !error && filteredLoans.length > 0 && (
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                <th className="px-5 py-3.5 lg:px-6">Customer</th>
                                <th className="px-5 py-3.5">Loan</th>
                                <th className="px-5 py-3.5">Amount</th>
                                <th className="px-5 py-3.5">Outstanding</th>
                                <th className="px-5 py-3.5">Due Date</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="w-16 px-5 py-3.5" />
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLoans.map(
                                (loan) => {const classes = getStatusClasses(loan.status);
                                return (
                                    <tr key={ loan.id } onClick={() => handleViewLoan(loan.id)} className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50">
                                        <td className="px-5 py-4 lg:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${classes.avatar}`}>{getInitials(loan.client)}</div>
                                                    <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-slate-800">{loan.client || "Unknown customer"}</p>
                                                            {loan.mobile && (
                                                                <p className="mt-0.5 text-xs text-slate-400">{loan.mobile}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-semibold text-blue-600">PAY{loan.id}</p>
                                                    <p className="mt-0.5 text-xs text-slate-400">Loan</p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-semibold text-slate-900">{formatKES(loan.amount)}</p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-semibold text-slate-900">{formatKES(loan.balance)}</p>
                                                    <p className="mt-0.5 text-xs text-slate-400">remaining</p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm text-slate-600">{formatDate(loan.pay_date)}</p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${classes.badge}`}>{loan.status}</span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <button type="button" onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleViewLoan(loan.id);
                                                        }}
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={`View loan ${loan.id}`}>
                                                        <Eye size={17}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            {!isLoading && !error && filteredLoans.length > 0 && (
                <div className="divide-y divide-slate-100 md:hidden">
                    {filteredLoans.map((loan) => {
                        const classes = getStatusClasses(loan.status);
                        return (
                            <button key={loan.id} type="button" onClick={() => handleViewLoan(loan.id)} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition active:bg-slate-50">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${classes.avatar}`}>{getInitials(loan.client)}</div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-800">{loan.client || "Unknown customer"}</p>
                                                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                                                    {formatKES(loan.balance)}
                                                    <span className="ml-1 text-xs font-normal text-slate-400">outstanding</span>
                                                </p>

                                                <p className="mt-1 truncate text-[11px] text-slate-400">LN00{loan.id}{" · "}{formatKES(loan.amount)} {" · "} Due{" "}{formatDate(loan.pay_date)}</p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${classes.badge}`}>{loan.status}</span>
                                            <ChevronRight size={16} className="text-slate-300"/>
                                        </div>
                                    </button>
                                );
                            }
                        )}
                    </div>
                )}
        </section>
    );
}