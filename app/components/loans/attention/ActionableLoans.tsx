"use client";

import { ArrowRight, AlertTriangle, CalendarClock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import LoanActionModal from "./LoanActionModal";

export interface ActionableLoans {
    id: number;
    client_id?: string;
    client: string;
    balance: string;
    due_date: string;
    status: "Today" | "Tomorrow" | "Overdue" | "Upcoming";
    days_overdue?: number;
}

async function fetchActionableLoans(): Promise<ActionableLoans[]> {
    const response = await fetch(
        "http://127.0.0.1:5000/actionable_loans"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch actionable loans");
    }

    return response.json();
}

export default function ActionableLoansSection() {
    const router = useRouter();

    const [selectedLoan, setSelectedLoan] =
        useState<ActionableLoans | null>(null);

    const {
        data: actionableLoans = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["actionableLoans"],
        queryFn: fetchActionableLoans,
        refetchInterval: 60 * 1000,
    });

    /*
     * Sort the most urgent loans first.
     *
     * Backend should ideally already return them in this order,
     * but doing it here keeps the dashboard safe if the API order changes.
     */
    const urgencyOrder: Record<ActionableLoans["status"], number> = {
        Overdue: 0,
        Today: 1,
        Tomorrow: 2,
        Upcoming: 3,
    };

    const sortedLoans = [...actionableLoans].sort((a, b) => {
        const statusDifference =
            urgencyOrder[a.status] - urgencyOrder[b.status];

        if (statusDifference !== 0) {
            return statusDifference;
        }

        // For overdue loans, show the oldest overdue first.
        if (
            a.status === "Overdue" &&
            b.status === "Overdue"
        ) {
            return (
                (b.days_overdue ?? 0) -
                (a.days_overdue ?? 0)
            );
        }

        return (
            new Date(a.due_date).getTime() -
            new Date(b.due_date).getTime()
        );
    });

    /*
     * Dashboard should only show a small number of loans.
     * The full actionable page shows everything.
     */
    const displayedLoans = sortedLoans.slice(0, 5);

    const overdueCount = actionableLoans.filter(
        (loan) => loan.status === "Overdue"
    ).length;

    const todayCount = actionableLoans.filter(
        (loan) => loan.status === "Today"
    ).length;

    const tomorrowCount = actionableLoans.filter(
        (loan) => loan.status === "Tomorrow"
    ).length;

    const getStatusLabel = (loan: ActionableLoans) => {
        if (loan.status === "Overdue") {
            const days = loan.days_overdue ?? 0;

            if (days === 1) {
                return "1 day overdue";
            }

            if (days > 1) {
                return `${days} days overdue`;
            }

            return "Overdue";
        }

        if (loan.status === "Today") {
            return "Due today";
        }

        if (loan.status === "Tomorrow") {
            return "Due tomorrow";
        }

        return "Upcoming";
    };

    const getStatusClasses = (
        status: ActionableLoans["status"]
    ) => {
        switch (status) {
            case "Overdue":
                return {
                    badge: "bg-red-50 text-red-700",
                    icon: "bg-red-100 text-red-600",
                };

            case "Today":
                return {
                    badge: "bg-amber-50 text-amber-700",
                    icon: "bg-amber-100 text-amber-600",
                };

            case "Tomorrow":
                return {
                    badge: "bg-blue-50 text-blue-700",
                    icon: "bg-blue-100 text-blue-600",
                };

            default:
                return {
                    badge: "bg-slate-100 text-slate-600",
                    icon: "bg-slate-100 text-slate-600",
                };
        }
    };

    return (
        <>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                                    Needs Attention
                                </h2>

                                {actionableLoans.length > 0 && (
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                        {actionableLoans.length}
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                Loans requiring attention
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/dashboard/loans/actionable"
                                )
                            }
                            className="
                                flex shrink-0 items-center gap-1
                                text-xs font-semibold text-blue-600
                                transition hover:text-blue-700
                                sm:text-sm
                            "
                        >
                            View all
                            <ArrowRight size={15} />
                        </button>
                    </div>

                    {/* Summary */}
                    {!isLoading && !error && actionableLoans.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            {overdueCount > 0 && (
                                <span className="font-medium text-red-600">
                                    {overdueCount} overdue
                                </span>
                            )}

                            {todayCount > 0 && (
                                <span className="font-medium text-amber-600">
                                    {todayCount} due today
                                </span>
                            )}

                            {tomorrowCount > 0 && (
                                <span className="font-medium text-blue-600">
                                    {tomorrowCount} tomorrow
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="divide-y divide-slate-100">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 sm:p-5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />

                                    <div className="space-y-2">
                                        <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                                        <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                                    </div>
                                </div>

                                <div className="space-y-2 text-right">
                                    <div className="ml-auto h-5 w-20 animate-pulse rounded-full bg-slate-100" />
                                    <div className="ml-auto h-3 w-16 animate-pulse rounded bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <div className="px-5 py-10 text-center">
                        <AlertTriangle
                            size={24}
                            className="mx-auto text-red-400"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-700">
                            Unable to load actionable loans
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Please try again shortly.
                        </p>
                    </div>
                )}

                {/* Empty */}
                {!isLoading &&
                    !error &&
                    actionableLoans.length === 0 && (
                        <div className="px-5 py-10 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                                <CalendarClock
                                    size={22}
                                    className="text-green-600"
                                />
                            </div>

                            <p className="mt-3 text-sm font-semibold text-slate-800">
                                Nothing needs attention
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                There are no overdue or upcoming loans
                                requiring action.
                            </p>
                        </div>
                    )}

                {/* Loans */}
                {!isLoading &&
                    !error &&
                    displayedLoans.length > 0 && (
                        <div className="divide-y divide-slate-100">
                            {displayedLoans.map((loan) => {
                                const styles = getStatusClasses(
                                    loan.status
                                );

                                return (
                                    <button
                                        key={loan.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedLoan(loan)
                                        }
                                        className="
                                            group flex w-full
                                            items-center justify-between
                                            gap-3
                                            p-4 text-left
                                            transition
                                            hover:bg-slate-50
                                            sm:p-5
                                        "
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            {/* Avatar */}
                                            <div
                                                className={`
                                                    flex h-10 w-10
                                                    shrink-0 items-center
                                                    justify-center
                                                    rounded-full
                                                    text-xs font-semibold
                                                    sm:h-11 sm:w-11
                                                    ${styles.icon}
                                                `}
                                            >
                                                {loan.client
                                                    .split(" ")
                                                    .map(
                                                        (name) =>
                                                            name[0]
                                                    )
                                                    .join("")
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </div>

                                            {/* Customer */}
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-semibold text-slate-800">
                                                    {loan.client}
                                                </h3>

                                                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                                                    KES{" "}
                                                    {Number(
                                                        loan.balance
                                                    ).toLocaleString()}{" "}
                                                    outstanding
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex shrink-0 items-center gap-2">
                                            <div className="text-right">
                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-full
                                                        px-2.5 py-1
                                                        text-[10px]
                                                        font-semibold
                                                        sm:text-xs
                                                        ${styles.badge}
                                                    `}
                                                >
                                                    {getStatusLabel(loan)}
                                                </span>

                                                <p className="mt-1.5 text-[11px] text-slate-400 sm:text-xs">
                                                    Due{" "}
                                                    {loan.due_date}
                                                </p>
                                            </div>

                                            <ArrowRight
                                                size={16}
                                                className="
                                                    hidden
                                                    text-slate-300
                                                    transition
                                                    group-hover:translate-x-0.5
                                                    group-hover:text-slate-500
                                                    sm:block
                                                "
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                {/* More indicator */}
                {!isLoading &&
                    !error &&
                    actionableLoans.length > displayedLoans.length && (
                        <div className="border-t border-slate-100 px-4 py-3 sm:px-5">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/dashboard/loans/actionable"
                                    )
                                }
                                className="
                                    flex w-full items-center
                                    justify-center gap-1
                                    text-xs font-medium
                                    text-slate-500
                                    transition
                                    hover:text-blue-600
                                "
                            >
                                View{" "}
                                {actionableLoans.length -
                                    displayedLoans.length}{" "}
                                more loans
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    )}
            </section>

            {/* Loan action sheet/modal */}
            <LoanActionModal
                open={selectedLoan !== null}
                loan={selectedLoan}
                onClose={() => setSelectedLoan(null)}
            />
        </>
    );
}