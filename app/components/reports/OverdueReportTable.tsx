"use client";

import {
    AlertTriangle,
    ChevronRight,
    Download,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OverdueLoan {
    id: string;
    client: string;
    client_id?: string;
    mobile?: string;
    due_date: string;
    days_overdue: number;
    balance: string;
}

interface OverdueReportTableProps {
    loans: OverdueLoan[];
}

function formatCurrency(value: string) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "KES 0";
    }

    return `KES ${number.toLocaleString("en-KE", {
        maximumFractionDigits: 0,
    })}`;
}

export default function OverdueReportTable({
    loans,
}: OverdueReportTableProps) {
    const router = useRouter();

    const totalOverdue = loans.reduce(
        (total, loan) =>
            total + Number(loan.balance || 0),
        0
    );

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div
                className="
                    flex flex-col gap-3
                    border-b border-slate-200
                    p-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:p-5
                "
            >
                <div>
                    <div className="flex items-center gap-2">
                        <AlertTriangle
                            size={18}
                            className="text-orange-500"
                        />

                        <h2 className="text-base font-semibold text-slate-900">
                            Overdue Loans
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        Loans that require collection attention.
                    </p>
                </div>

                <button
                    type="button"
                    className="
                        flex h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border border-slate-200
                        px-3
                        text-sm
                        font-medium
                        text-slate-600
                        transition
                        hover:bg-slate-50
                    "
                >
                    <Download size={16} />
                    Export
                </button>
            </div>

            {/* Summary */}
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                        Outstanding overdue
                    </span>

                    <span className="text-sm font-bold text-red-600">
                        {formatCurrency(
                            totalOverdue.toString()
                        )}
                    </span>
                </div>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-slate-100 md:hidden">
                {loans.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                        No overdue loans found.
                    </div>
                ) : (
                    loans.map((loan) => (
                        <button
                            key={loan.id}
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/dashboard/loans/${loan.id}`
                                )
                            }
                            className="
                                flex w-full
                                items-center
                                justify-between
                                gap-4
                                p-4
                                text-left
                                transition
                                hover:bg-slate-50
                            "
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {loan.client}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Loan #{loan.id}
                                </p>

                                <p className="mt-1 text-xs text-red-600">
                                    {loan.days_overdue} days overdue
                                </p>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="text-sm font-bold text-slate-900">
                                    {formatCurrency(
                                        loan.balance
                                    )}
                                </p>

                                <ChevronRight
                                    size={17}
                                    className="ml-auto mt-1 text-slate-400"
                                />
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70">
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Customer
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Loan
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Due Date
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Days Overdue
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Outstanding
                            </th>

                            <th className="w-10 px-5 py-3" />
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {loans.map((loan) => (
                            <tr
                                key={loan.id}
                                onClick={() =>
                                    router.push(
                                        `/dashboard/loans/${loan.id}`
                                    )
                                }
                                className="
                                    cursor-pointer
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                <td className="px-5 py-4">
                                    <p className="text-sm font-medium text-slate-900">
                                        {loan.client}
                                    </p>

                                    {loan.mobile && (
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {loan.mobile}
                                        </p>
                                    )}
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                    #{loan.id}
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                    {loan.due_date}
                                </td>

                                <td className="px-5 py-4">
                                    <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                                        {loan.days_overdue} days
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-right text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        loan.balance
                                    )}
                                </td>

                                <td className="px-5 py-4">
                                    <ChevronRight
                                        size={17}
                                        className="text-slate-400"
                                    />
                                </td>
                            </tr>
                        ))}

                        {loans.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-10 text-center text-sm text-slate-500"
                                >
                                    No overdue loans found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}