"use client";

import { useEffect, useState } from "react";
import {
    AlertTriangle,
    Loader2,
    ShieldAlert,
    User,
    X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface Customer {
    id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    mobile: string;
    status?: string;
}

interface BlacklistCustomerModalProps {
    open: boolean;
    onClose: () => void;
    customer: Customer | null;
}

export default function BlacklistCustomerModal({
    open,
    onClose,
    customer,
}: BlacklistCustomerModalProps) {
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (open) {
            setReason("");
            setLoading(false);
        }
    }, [open, customer]);

    if (!open || !customer) {
        return null;
    }

    const fullName = [
        customer.first_name,
        customer.middle_name,
        customer.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    const initials = `${customer.first_name?.[0] ?? ""}${
        customer.last_name?.[0] ?? ""
    }`.toUpperCase();

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/customers/${customer.id}/blacklist`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reason: reason.trim() || null,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Failed to blacklist customer."
                );
            }

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["customers"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["customerSummary"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["customer", customer.id],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["activities"],
                }),
            ]);

            onClose();
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to blacklist customer."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-end justify-center
                bg-slate-950/40
                p-0
                backdrop-blur-[2px]
                sm:items-center
                sm:p-4
            "
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-t-2xl
                    bg-white
                    shadow-2xl
                    sm:rounded-2xl
                "
            >
                {/* Header */}
                <div className="
                    flex items-start
                    justify-between
                    border-b border-slate-200
                    px-5 py-4
                    sm:px-6
                ">
                    <div className="flex items-center gap-3">
                        <div className="
                            flex h-10 w-10
                            items-center justify-center
                            rounded-xl
                            bg-red-50
                        ">
                            <ShieldAlert
                                size={21}
                                className="text-red-600"
                            />
                        </div>

                        <div>
                            <h2 className="
                                text-base
                                font-semibold
                                text-slate-900
                            ">
                                Blacklist Customer
                            </h2>

                            <p className="
                                mt-0.5
                                text-xs
                                text-slate-500
                            ">
                                Review this action before continuing.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-lg
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-600
                        "
                    >
                        <X size={19} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-5 sm:p-6">

                        {/* Customer */}
                        <div className="
                            flex items-center
                            gap-3
                            rounded-xl
                            border border-slate-200
                            bg-slate-50
                            p-4
                        ">
                            <div className="
                                flex h-11 w-11
                                shrink-0
                                items-center justify-center
                                rounded-full
                                bg-blue-100
                                text-sm
                                font-bold
                                text-blue-700
                            ">
                                {initials}
                            </div>

                            <div className="min-w-0">
                                <p className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                ">
                                    {fullName}
                                </p>

                                <div className="
                                    mt-0.5
                                    flex
                                    flex-wrap
                                    gap-x-3
                                    text-xs
                                    text-slate-500
                                ">
                                    <span>
                                        ID: {customer.id}
                                    </span>

                                    <span>
                                        {customer.mobile}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="
                            mt-4
                            flex gap-3
                            rounded-xl
                            border border-red-100
                            bg-red-50
                            p-4
                        ">
                            <AlertTriangle
                                size={19}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-red-600
                                "
                            />

                            <div>
                                <p className="
                                    text-sm
                                    font-semibold
                                    text-red-800
                                ">
                                    New loans will be blocked
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-red-700
                                ">
                                    Blacklisting this customer will
                                    prevent them from receiving new
                                    loans. Existing loans and payment
                                    history will remain unchanged.
                                </p>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="mt-5">
                            <label
                                htmlFor="blacklist-reason"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                "
                            >
                                Reason
                                <span className="
                                    ml-1
                                    font-normal
                                    text-slate-400
                                ">
                                    (optional)
                                </span>
                            </label>

                            <textarea
                                id="blacklist-reason"
                                value={reason}
                                onChange={(e) =>
                                    setReason(
                                        e.target.value
                                    )
                                }
                                rows={3}
                                maxLength={500}
                                placeholder="Why is this customer being blacklisted?"
                                disabled={loading}
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3.5 py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                    disabled:cursor-not-allowed
                                    disabled:bg-slate-50
                                "
                            />

                            <div className="
                                mt-1
                                text-right
                                text-xs
                                text-slate-400
                            ">
                                {reason.length}/500
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="
                        flex flex-col-reverse
                        gap-2
                        border-t border-slate-200
                        bg-slate-50
                        px-5 py-4
                        sm:flex-row
                        sm:justify-end
                        sm:px-6
                    ">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                border border-slate-200
                                bg-white
                                px-4 py-3
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                sm:w-auto
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-red-600
                                px-4 py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-red-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                sm:w-auto
                            "
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />
                                    Blacklisting...
                                </>
                            ) : (
                                <>
                                    <ShieldAlert
                                        size={17}
                                    />
                                    Blacklist Customer
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}