"use client";

import { useQuery } from "@tanstack/react-query";
import {
    CalendarCheck,
    CircleDollarSign,
    CreditCard,
    Wallet,
} from "lucide-react";

interface PaymentSummaryData {
    collected_this_month: number;
    collected_today: number;
    expected_this_month: number;
    total_transactions: number;
    transactions_today: number;
}

const fallbackData: PaymentSummaryData = {
    collected_this_month: 0,
    collected_today: 0,
    expected_this_month: 0,
    total_transactions: 0,
    transactions_today: 0,
};

const formatKES = (value: number) => `KES ${value.toLocaleString("en-KE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

export default function PaymentSummary() { const { data, isLoading, isError, } = useQuery<PaymentSummaryData>({
        queryKey: ["paymentSummary"],
        queryFn: async () => {
            const response = await fetch(
                "/api/payments/summary",
                {
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load payment summary"
                );
            }

            return response.json();
        },
        refetchOnWindowFocus: true,
    });

    const summary = data ?? fallbackData;
    const cards = [
        {
            title: "Collected This Month",
            value: formatKES(summary.collected_this_month),
            description: "Total received this month",
            icon: Wallet,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "Collected Today",
            value: formatKES(summary.collected_today),
            description: `${summary.transactions_today.toLocaleString()} ${
                summary.transactions_today === 1
                    ? "payment"
                    : "payments"
            } received today`,
            icon: CalendarCheck,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Expected This Month",
            value: formatKES(summary.expected_this_month),
            description: "Scheduled payments due this month",
            icon: CircleDollarSign,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
        },
        {
            title: "Transactions",
            value: summary.total_transactions.toLocaleString(),
            description: "Payments recorded this month",
            icon: CreditCard,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-slate-500 sm:text-sm"> {card.title}</p>
                                <p className="mt-2 truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"> {isLoading ? "—" : card.value}</p>
                                <p className="mt-1 text-xs text-slate-400">{card.description}</p>
                            </div>
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} sm:h-11 sm:w-11`}>
                                <Icon size={20} />
                            </div>
                        </div>
                    </div>
                );
            })}

            {isError && (
                <p className="col-span-full text-sm text-red-500">Unable to refresh payment summary.</p>
            )}
        </div>
    );
}