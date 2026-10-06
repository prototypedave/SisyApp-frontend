"use client";

import {
    AlertTriangle,
    Bell,
    CreditCard,
    ExternalLink,
    MoreHorizontal,
    User,
    X,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/app/components/ui/ToastProvider";
import PaymentModal from "../../modals/PaymentModal";

interface ActionableLoan {
    id: number;
    client_id?: string;
    client: string;
    balance: string;
    due_date: string;
    status: "Today" | "Tomorrow" | "Overdue" | "Upcoming";
    days_overdue?: number;
}

interface LoanActionModalProps {
    open: boolean;
    loan: ActionableLoan | null;
    onClose: () => void;
}

export default function LoanActionModal({
    open,
    loan,
    onClose,
}: LoanActionModalProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [showMore, setShowMore] = useState(false);

    if (!open || !loan) return null;

    const handleReminder = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/send_reminder/${loan.id}`,
                {
                    method: "POST",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                showToast(
                    result.message || "Unable to send reminder.",
                    "error"
                );
                return;
            }

            showToast(result.message || "Reminder sent successfully.");

            // Refresh activity after reminder.
            queryClient.invalidateQueries({
                queryKey: ["activities"],
            });

            onClose();
        } catch (error) {
            console.error("Reminder error:", error);

            showToast(
                "Unable to connect to the server.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBlacklist = async () => {
        if (!loan.client_id) {
            showToast(
                "Customer information is unavailable.",
                "error"
            );
            return;
        }

        const confirmed = window.confirm(
            `Blacklist ${loan.client}?\n\nThis will prevent the customer from taking new loans.`
        );

        if (!confirmed) return;

        setLoading(true);

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/blacklist_client/${loan.client_id}`,
                {
                    method: "PATCH",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                showToast(
                    result.message || "Unable to blacklist customer.",
                    "error"
                );
                return;
            }

            showToast(
                result.message || "Customer blacklisted successfully."
            );

            queryClient.invalidateQueries({
                queryKey: ["actionableLoans"],
            });

            queryClient.invalidateQueries({
                queryKey: ["activities"],
            });

            setShowMore(false);
            onClose();
        } catch (error) {
            console.error("Blacklist error:", error);

            showToast(
                "Unable to connect to the server.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleViewLoan = () => {
        onClose();
        router.push(`/dashboard/loans/${loan.id}`);
    };

    const handleViewCustomer = () => {
        if (!loan.client_id) {
            showToast(
                "Customer information is unavailable.",
                "error"
            );
            return;
        }

        onClose();
        router.push(`/dashboard/customers/${loan.client_id}`);
    };

    const getStatusStyles = () => {
        switch (loan.status) {
            case "Overdue":
                return {
                    container: "bg-red-50 border-red-100",
                    icon: "bg-red-100 text-red-600",
                    text: "text-red-700",
                };

            case "Today":
                return {
                    container: "bg-amber-50 border-amber-100",
                    icon: "bg-amber-100 text-amber-600",
                    text: "text-amber-700",
                };

            case "Tomorrow":
                return {
                    container: "bg-blue-50 border-blue-100",
                    icon: "bg-blue-100 text-blue-600",
                    text: "text-blue-700",
                };

            default:
                return {
                    container: "bg-slate-50 border-slate-100",
                    icon: "bg-slate-100 text-slate-600",
                    text: "text-slate-700",
                };
        }
    };

    const statusStyles = getStatusStyles();

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Mobile bottom sheet / desktop centered modal */}
            <div
                className="
                    fixed inset-x-0 bottom-0 z-50
                    mx-auto w-full
                    sm:inset-0 sm:flex sm:items-center sm:justify-center
                    sm:p-4
                "
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="
                        w-full overflow-hidden
                        rounded-t-3xl bg-white shadow-2xl
                        sm:max-w-md sm:rounded-2xl
                    "
                >
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                                {loan.client
                                    .split(" ")
                                    .map((name) => name[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                                <h2 className="truncate text-base font-semibold text-slate-900">
                                    {loan.client}
                                </h2>

                                <p className="mt-0.5 text-sm text-slate-500">
                                    Loan #{loan.id}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex h-10 w-10 shrink-0 items-center justify-center
                                rounded-xl text-slate-400
                                transition hover:bg-slate-100 hover:text-slate-600
                            "
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Loan summary */}
                    <div className="p-5">
                        <div
                            className={`
                                rounded-2xl border p-4
                                ${statusStyles.container}
                            `}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Outstanding
                                    </p>

                                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                        KES{" "}
                                        {Number(loan.balance).toLocaleString()}
                                    </p>
                                </div>

                                <div
                                    className={`
                                        flex h-10 w-10 items-center justify-center
                                        rounded-xl ${statusStyles.icon}
                                    `}
                                >
                                    {loan.status === "Overdue" ? (
                                        <AlertTriangle size={20} />
                                    ) : (
                                        <CreditCard size={20} />
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                                <span
                                    className={`font-semibold ${statusStyles.text}`}
                                >
                                    {loan.status === "Overdue" &&
                                    loan.days_overdue
                                        ? `${loan.days_overdue} day${
                                              loan.days_overdue === 1
                                                  ? ""
                                                  : "s"
                                          } overdue`
                                        : loan.status === "Today"
                                        ? "Due today"
                                        : loan.status === "Tomorrow"
                                        ? "Due tomorrow"
                                        : loan.status}
                                </span>

                                <span className="text-slate-400">
                                    •
                                </span>

                                <span className="text-slate-500">
                                    Due {loan.due_date}
                                </span>
                            </div>
                        </div>

                        {/* Primary actions */}
                        <div className="mt-5 space-y-3">
                            <button
                                type="button"
                                onClick={() => setPaymentModalOpen(true)}
                                disabled={loading}
                                className="
                                    flex w-full items-center justify-center gap-2
                                    rounded-xl bg-blue-600 px-4 py-3.5
                                    text-sm font-semibold text-white
                                    transition
                                    hover:bg-blue-700
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <CreditCard size={18} />
                                Record Payment
                            </button>

                            <button
                                type="button"
                                onClick={handleReminder}
                                disabled={loading}
                                className="
                                    flex w-full items-center justify-center gap-2
                                    rounded-xl border border-slate-200
                                    bg-white px-4 py-3.5
                                    text-sm font-semibold text-slate-700
                                    transition
                                    hover:bg-slate-50
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <Bell size={18} />
                                {loading
                                    ? "Sending..."
                                    : "Send Reminder"}
                            </button>
                        </div>

                        {/* Navigation actions */}
                        <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
                            <button
                                type="button"
                                onClick={handleViewLoan}
                                className="
                                    flex w-full items-center justify-between
                                    px-4 py-3.5 text-left
                                    transition hover:bg-slate-50
                                "
                            >
                                <span className="flex items-center gap-3">
                                    <ExternalLink
                                        size={17}
                                        className="text-slate-400"
                                    />

                                    <span className="text-sm font-medium text-slate-700">
                                        View loan
                                    </span>
                                </span>

                                <span className="text-slate-300">→</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleViewCustomer}
                                className="
                                    flex w-full items-center justify-between
                                    px-4 py-3.5 text-left
                                    transition hover:bg-slate-50
                                "
                            >
                                <span className="flex items-center gap-3">
                                    <User
                                        size={17}
                                        className="text-slate-400"
                                    />

                                    <span className="text-sm font-medium text-slate-700">
                                        View customer
                                    </span>
                                </span>

                                <span className="text-slate-300">→</span>
                            </button>
                        </div>

                        {/* More */}
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowMore((current) => !current)
                                }
                                className="
                                    flex w-full items-center justify-center gap-2
                                    rounded-xl px-4 py-3
                                    text-sm font-medium text-slate-500
                                    transition hover:bg-slate-50
                                "
                            >
                                <MoreHorizontal size={18} />
                                More
                            </button>

                            {showMore && (
                                <div className="mt-2 rounded-xl border border-slate-200 p-1">
                                    <button
                                        type="button"
                                        onClick={handleBlacklist}
                                        disabled={loading}
                                        className="
                                            w-full rounded-lg px-3 py-3
                                            text-left text-sm font-medium
                                            text-red-600
                                            transition hover:bg-red-50
                                            disabled:opacity-50
                                        "
                                    >
                                        Blacklist customer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile safe-area spacing */}
                    <div className="h-[env(safe-area-inset-bottom)] sm:hidden" />
                </div>
            </div>

            {/* Payment modal */}
            <PaymentModal
                open={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
            />
        </>
    );
}