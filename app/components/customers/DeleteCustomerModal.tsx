"use client";

import { useState } from "react";
import {
    AlertTriangle,
    Loader2,
    Trash2,
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
    active_loans?: number;
}

interface DeleteCustomerModalProps {
    open: boolean;
    onClose: () => void;
    customer: Customer | null;
}

export default function DeleteCustomerModal({
    open,
    onClose,
    customer,
}: DeleteCustomerModalProps) {
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open || !customer) {
        return null;
    }

    const customerName = [
        customer.first_name,
        customer.middle_name,
        customer.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    const handleDelete = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/customers/${customer.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete customer."
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
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
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
                sm:items-center
                sm:p-4
            "
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="
                    flex w-full max-w-md
                    flex-col
                    overflow-hidden
                    rounded-t-2xl
                    bg-white
                    shadow-xl
                    sm:rounded-2xl
                "
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                            <Trash2
                                size={20}
                                className="text-red-600"
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Delete Customer
                            </h2>

                            <p className="text-xs text-slate-500">
                                This action requires confirmation
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            flex h-10 w-10
                            items-center justify-center
                            rounded-xl
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-600
                            disabled:cursor-not-allowed
                        "
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">
                            {customerName}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            ID: {customer.id}
                        </p>

                        <p className="text-sm text-slate-500">
                            Mobile: {customer.mobile}
                        </p>
                    </div>

                    <div className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <AlertTriangle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div className="text-sm">
                            <p className="font-semibold text-red-800">
                                Are you sure you want to delete this customer?
                            </p>

                            <p className="mt-1 leading-5 text-red-700">
                                This may remove the customer from your
                                active customer records. Customer data
                                associated with loans and payments should
                                be preserved where required.
                            </p>
                        </div>
                    </div>

                    {customer.active_loans &&
                        customer.active_loans > 0 && (
                            <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                                This customer currently has{" "}
                                <strong>
                                    {customer.active_loans} active loan
                                    {customer.active_loans === 1
                                        ? ""
                                        : "s"}
                                </strong>
                                . They should not be permanently deleted
                                while those loans are active.
                            </div>
                        )}

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="
                        flex flex-col-reverse gap-2
                        border-t border-slate-200
                        bg-white
                        p-4
                        sm:flex-row
                        sm:justify-end
                        sm:px-5
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            flex h-11
                            items-center justify-center
                            rounded-xl
                            border border-slate-200
                            px-4
                            text-sm font-medium
                            text-slate-700
                            transition
                            hover:bg-slate-50
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="
                            flex h-11
                            items-center justify-center
                            gap-2
                            rounded-xl
                            bg-red-600
                            px-4
                            text-sm font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-red-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {loading ? (
                            <>
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={17} />
                                Delete Customer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}