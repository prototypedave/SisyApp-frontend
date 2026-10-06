"use client";

import { useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    CreditCard,
    Wallet,
    CircleDollarSign,
} from "lucide-react";
import { formatKES } from "../Utils";

interface LoanSummaryData {
    active_loans: number;
    outstanding: number;
    due_today: number;
    overdue: number;
}

const fallbackData: LoanSummaryData = {
    active_loans: 0,
    outstanding: 0,
    due_today: 0,
    overdue: 0,
};


export default function LoanSummary() { const { data, isLoading, isError, } = useQuery<LoanSummaryData>({
        queryKey: ["loanSummary"],
        queryFn: async () => {
            const response = await fetch("/api/loans/summary", { cache: "no-store", });

            if (!response.ok) {
                throw new Error("Failed to load payment summary");
            }
            return response.json();
        },
        refetchOnWindowFocus: true,
    });
    const summary = data ?? fallbackData;
    const cards = [
        {
            title: "Active Loans",
            value: Number(summary.active_loans),
            description: "Currently active",
            icon: CreditCard,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Outstanding",
            value: formatKES(summary.outstanding),
            description: "Total outstanding",
            icon: Wallet,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
        },
        {
            title: "Due Today",
            value: Number(summary.due_today),
            description: "Loans due today",
            icon: CircleDollarSign,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
        {
            title: "Overdue",
            value: Number(summary.overdue),
            description: "Require attention",
            icon: AlertCircle,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
        },
    ]
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((item) => {
                const Icon = item.icon;
                return (
                    <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-slate-500 sm:text-sm">{item.title}</p>
                                <p className="mt-2 truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{item.value}</p>
                                <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                            </div>
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor} sm:h-11 sm:w-11`}>
                                <Icon size={20} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}