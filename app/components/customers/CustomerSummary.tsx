"use client";

import {
    Users,
    UserCheck,
    AlertTriangle,
    UserX,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

interface CustomerSummaryData {
    total_customers: number;
    active_borrowers: number;
    overdue_customers: number;
    blacklisted: number;
}

const fallbackData: CustomerSummaryData = {
    total_customers: 0,
    active_borrowers: 0,
    overdue_customers: 0,
    blacklisted: 0,
};

export default function CustomerSummary() {
    const { data, isLoading, isError, } = useQuery<CustomerSummaryData>({
        queryKey: ["customerSummary"],
        queryFn: async () => {
            const response = await fetch(
                "/api/customers/summary",
                {
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error( "Failed to load customer summary");
            }
            return response.json();
        },
        refetchOnWindowFocus: true,
    });

    const summary = data ?? fallbackData;
    const cards = [
        {
            title: "Total Customers",
            value: summary.total_customers,
            icon: Users,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            title: "Active Borrowers",
            value: summary.active_borrowers,
            icon: UserCheck,
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            title: "With Overdue Loans",
            value: summary.overdue_customers,
            icon: AlertTriangle,
            iconBg: "bg-orange-50",
            iconColor: "text-orange-600",
        },
        {
            title: "Blacklisted",
            value: summary.blacklisted,
            icon: UserX,
            iconBg: "bg-red-50",
            iconColor: "text-red-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.title} className=" rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-slate-500 sm:text-sm">{card.title}</p>
                                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    {isLoading ? "—" : card.value.toLocaleString( "en-KE" )}
                                </p>
                            </div>
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg} sm:h-12 sm:w-12`}>
                                <Icon size={20} className={card.iconColor}/>
                            </div>
                        </div>
                        {isError && (
                            <p className="mt-2 text-xs text-red-500"> Unable to refresh</p>
                        )}
                    </div>
                );
            })}

        </div>
    );
}