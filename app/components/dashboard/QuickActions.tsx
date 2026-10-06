
"use client";

import {
    ArrowUpRight,
    BadgeDollarSign,
    CreditCard,
    UserPlus,
    FileBarChart,
} from "lucide-react";
import { useState } from "react";

import PaymentModal from "../modals/PaymentModal";
import CustomerModal from "../customers/CustomerModal";
import LoanModal from "../modals/LoanModal";

export default function QuickActions() {
    const [loanModalOpen, setLoanModalOpen] = useState(false);
    const [payModalOpen, setPayModalOpen] = useState(false);
    const [customerModalOpen, setCustomerModalOpen] = useState(false);

    const actions = [
        {
            title: "New Loan",
            description: "Create a loan",
            onClick: () => setLoanModalOpen(true),
            icon: BadgeDollarSign,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            featured: true,
        },
        {
            title: "Record Payment",
            description: "Record repayment",
            onClick: () => setPayModalOpen(true),
            icon: CreditCard,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            featured: false,
        },
        {
            title: "Add Customer",
            description: "Register borrower",
            onClick: () => setCustomerModalOpen(true),
            icon: UserPlus,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            featured: false,
        },
        {
            title: "Generate Report",
            description: "View loan reports",
            onClick: () => {
                // TODO: Connect to reports page / report generation.
            },
            icon: FileBarChart,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            featured: false,
        },
    ];

    return (
        <>
            <section
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >
                {/* Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        px-4
                        py-4
                        sm:px-5
                        sm:py-5
                        lg:px-6
                    "
                >
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                            Quick Actions
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                            Common tasks
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3
                        p-3
                        sm:gap-4
                        sm:p-4
                        lg:grid-cols-4
                        lg:p-5
                    "
                >
                    {actions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <button
                                key={action.title}
                                type="button"
                                onClick={action.onClick}
                                className={`
                                    group
                                    relative
                                    flex
                                    min-h-[118px]
                                    flex-col
                                    items-start
                                    justify-between
                                    rounded-2xl
                                    border
                                    p-4
                                    text-left
                                    transition-all
                                    duration-200
                                    active:scale-[0.98]
                                    sm:min-h-[130px]
                                    sm:p-5
                                    ${
                                        action.featured
                                            ? `
                                                border-blue-200
                                                bg-blue-50/60
                                                hover:border-blue-300
                                                hover:bg-blue-50
                                            `
                                            : `
                                                border-slate-200
                                                bg-white
                                                hover:border-slate-300
                                                hover:bg-slate-50
                                            `
                                    }
                                `}
                            >
                                {/* Icon + arrow */}
                                <div className="flex w-full items-start justify-between">
                                    <div
                                        className={`
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            sm:h-11
                                            sm:w-11
                                            ${action.iconBg}
                                            ${action.iconColor}
                                            transition-transform
                                            duration-200
                                            group-hover:scale-105
                                        `}
                                    >
                                        <Icon
                                            size={21}
                                            strokeWidth={2}
                                        />
                                    </div>

                                    <ArrowUpRight
                                        size={17}
                                        className="
                                            text-slate-300
                                            transition-all
                                            duration-200
                                            group-hover:-translate-y-0.5
                                            group-hover:translate-x-0.5
                                            group-hover:text-slate-500
                                        "
                                    />
                                </div>

                                {/* Text */}
                                <div className="mt-3">
                                    <h3
                                        className={`
                                            text-sm
                                            font-semibold
                                            ${
                                                action.featured
                                                    ? "text-blue-900"
                                                    : "text-slate-800"
                                            }
                                        `}
                                    >
                                        {action.title}
                                    </h3>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {action.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Modals */}
            <LoanModal
                open={loanModalOpen}
                onClose={() => setLoanModalOpen(false)}
                mobile={""}
            />

            <PaymentModal
                open={payModalOpen}
                onClose={() => setPayModalOpen(false)}
            />

            <CustomerModal
                open={customerModalOpen}
                onClose={() => setCustomerModalOpen(false)}
            />
        </>
    );
}

