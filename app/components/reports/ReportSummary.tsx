"use client";

import {
    ArrowDownToLine,
    ArrowUpFromLine,
    CircleDollarSign,
    Percent,
} from "lucide-react";

interface ReportSummaryData {
    issued: string;
    collected: string;
    outstanding: string;
    interest_earned: string;
    collection_rate: number;
}

interface ReportSummaryProps {
    data: ReportSummaryData;
    loading?: boolean;
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

export default function ReportSummary({
    data,
    loading = false,
}: ReportSummaryProps) {
    const cards = [
        {
            title: "Total Issued",
            value: formatCurrency(data.issued),
            icon: ArrowUpFromLine,
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
        {
            title: "Total Collected",
            value: formatCurrency(data.collected),
            icon: ArrowDownToLine,
            bg: "bg-green-50",
            color: "text-green-600",
        },
        {
            title: "Outstanding",
            value: formatCurrency(data.outstanding),
            icon: CircleDollarSign,
            bg: "bg-orange-50",
            color: "text-orange-600",
        },
        {
            title: "Collection Rate",
            value: `${data.collection_rate}%`,
            icon: Percent,
            bg: "bg-purple-50",
            color: "text-purple-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="
                            rounded-2xl
                            border border-slate-200
                            bg-white
                            p-4
                            shadow-sm
                            sm:p-5
                        "
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                                    {card.title}
                                </p>

                                <p className="mt-2 truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                    {loading
                                        ? "—"
                                        : card.value}
                                </p>
                            </div>

                            <div
                                className={`
                                    flex h-10 w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    ${card.bg}
                                    sm:h-11
                                    sm:w-11
                                `}
                            >
                                <Icon
                                    size={19}
                                    className={card.color}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}