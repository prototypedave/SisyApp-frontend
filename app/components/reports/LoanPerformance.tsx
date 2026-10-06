"use client";

import {
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    AlertTriangle,
} from "lucide-react";

interface LoanPerformanceProps {
    data: {
        total_loans: number;
        active_loans: number;
        completed_loans: number;
        overdue_loans: number;
        interest_earned: string;
    };
}

export default function LoanPerformance({
    data,
}: LoanPerformanceProps) {
    const items = [
        {
            label: "Total Loans",
            value: data.total_loans,
            icon: CircleDollarSign,
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
        {
            label: "Active Loans",
            value: data.active_loans,
            icon: Clock3,
            bg: "bg-green-50",
            color: "text-green-600",
        },
        {
            label: "Completed Loans",
            value: data.completed_loans,
            icon: CheckCircle2,
            bg: "bg-slate-100",
            color: "text-slate-600",
        },
        {
            label: "Overdue Loans",
            value: data.overdue_loans,
            icon: AlertTriangle,
            bg: "bg-red-50",
            color: "text-red-600",
        },
    ];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div>
                <h2 className="text-base font-semibold text-slate-900">
                    Loan Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Overview of your loan portfolio.
                </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`
                                        flex h-8 w-8
                                        items-center
                                        justify-center
                                        rounded-lg
                                        ${item.bg}
                                    `}
                                >
                                    <Icon
                                        size={16}
                                        className={item.color}
                                    />
                                </div>

                                <span className="text-xs font-medium text-slate-500">
                                    {item.label}
                                </span>
                            </div>

                            <p className="mt-3 text-2xl font-bold text-slate-900">
                                {item.value.toLocaleString()}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">
                    Interest earned
                </span>

                <span className="text-sm font-semibold text-slate-900">
                    KES{" "}
                    {Number(
                        data.interest_earned
                    ).toLocaleString("en-KE", {
                        maximumFractionDigits: 0,
                    })}
                </span>
            </div>
        </div>
    );
}