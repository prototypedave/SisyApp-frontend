"use client";

import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    Search,
    UserRound,
    X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import InputField, {Customer, getFullName,} from "../Utils";
import { useToast } from "@/app/components/ui/ToastProvider";

interface LoanModalProps {
    open: boolean;
    customer?: Customer | null;
    onClose: () => void;
}
 
interface CustomerLookupResponse {
    customer: Customer;
    summary?: {
        active_loans?: number;
        outstanding?: string;
    };
}

interface FormData {
    mobile: string;
    amount: string;
    pay_date: string;
}

export default function LoanModal({ open, customer: initialCustomer = null, onClose,}: LoanModalProps) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [lookingUp, setLookingUp] = useState(false);
    const [customer, setCustomer] = useState<Customer | null>(initialCustomer);
    const [lookupError, setLookupError] = useState("");
    const [formData, setFormData] = useState<FormData>({
        mobile: initialCustomer?.mobile ?? "",
        amount: "",
        pay_date: "",
    });

    const today = useMemo(() => {
        return new Date()
            .toISOString()
            .split("T")[0];
    }, []);

    const lastDate = useMemo(() => {
        const date = new Date();
        date.setDate( date.getDate() + 30);
        return date
            .toISOString()
            .split("T")[0];
    }, []);

    useEffect(() => {
        if (!open) {
            return;
        }

        setCustomer(initialCustomer ?? null);
        setFormData({
            mobile: initialCustomer?.mobile ?? "",
            amount: "",
            pay_date: "",
        });

        setLookupError("");
        setLookingUp(false);
        setLoading(false);
    }, [
        open,
        initialCustomer?.id,
        initialCustomer?.mobile,
    ]);

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, } = e.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if ( name === "mobile" && customer && value !== customer.mobile ) {
            setCustomer(null);
            setLookupError("");
        }
    };

    const handleCustomerLookup = async () => {
        const mobile = formData.mobile.trim();
        if (!mobile) {
            setLookupError( "Enter a mobile number.");
            return;
        }

        setLookingUp(true);
        setLookupError("");
        setCustomer(null);

        try {
            const response = await fetch(
                `/api/customers/lookup?mobile=${encodeURIComponent(
                    mobile
                )}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                setLookupError(result.message || "Customer not found.");
                return;
            }

            const foundCustomer = result.customer;
            setCustomer(foundCustomer);
            setFormData((previous) => ({
                ...previous,
                mobile: foundCustomer.mobile,
            }));
        } catch (error) {
            console.error(
                "Customer lookup failed:",
                error
            );

            setLookupError("Unable to connect to the server.");
        } finally {
            setLookingUp(false);
        }
    };


    const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ( e.key === "Enter" && !customer ) {
            e.preventDefault();
            handleCustomerLookup();
        }
    };

    const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        if (!customer) {
            showToast(
                "Select a customer before assigning the loan.",
                "error"
            );
            return;
        }

        const amount = Number(formData.amount);
        if ( !formData.amount || Number.isNaN(amount) || amount <= 0) {
            showToast(
                "Enter a valid loan amount.",
                "error"
            );

            return;
        }

        if (!formData.pay_date) {
            showToast(
                "Select a loan due date.",
                "error"
            );

            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "/api/loans",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify({
                        client_id: customer.id,
                        amount: formData.amount,
                        pay_date: formData.pay_date,
                    }),
                }
            );

            const result = await response.json();
            console.log( "HTTP status:", response.status);
            console.log("Backend response:", result);

            if (!response.ok) {
                showToast(result.message || "Unable to assign loan.", "error");
                return;
            }

            showToast( "Loan assigned successfully.", "success");

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [ "customer", customer.id, ],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["customers"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["customerSummary"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["loans"],
                }),

                queryClient.invalidateQueries({
                    queryKey: [
                        "actionableLoans",
                    ],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["dashboard"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["portfolio"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["activities"],
                }),
            ]);

            onClose();
        } catch (error) {
            console.error( "Loan assignment failed:", error );
            showToast( "Unable to connect to the server.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!open) { return null; }

    const outstanding = Number( customer?.outstanding ?? 0 );
    const hasOutstanding = outstanding > 0;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900"> Assign Loan </h2>
                        <p className="mt-1 text-sm text-slate-500"> Create a new loan for a customer.</p>
                    </div>

                    <button type="button" onClick={onClose} disabled={loading} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="overflow-y-auto p-5 sm:p-6">
                        <div className="space-y-5">
                            {!customer ? (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Customer Mobile Number</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input type="tel" name="mobile" value={ formData.mobile }
                                                onChange={ handleChange }
                                                onKeyDown={ handleMobileKeyDown }
                                                placeholder="0712 345 678" autoComplete="tel" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                        <button type="button" onClick={ handleCustomerLookup }
                                            disabled={ lookingUp || !formData.mobile.trim() }
                                            className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {lookingUp ? (
                                                <Loader2 size={17} className="animate-spin"/>
                                            ) : (
                                                <Search size={17} />
                                            )}

                                            <span className="hidden sm:inline">
                                                {lookingUp ? "Searching..." : "Find"}
                                            </span>
                                        </button>
                                    </div>

                                    {lookupError && (
                                        <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                            <span>{ lookupError } </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700"> Customer </label>
                                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{customer.first_name?.[0]} {customer.last_name?.[0]}</div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{getFullName(customer)}</p>
                                                    <CheckCircle2 size={16} className="shrink-0 text-emerald-500"/>
                                                </div>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {customer.mobile}
                                                    {" • "}
                                                    ID:{" "}
                                                    {
                                                        customer.id
                                                    }
                                                </p>
                                            </div>

                                            {!initialCustomer && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCustomer(
                                                            null
                                                        );

                                                        setFormData(
                                                            (
                                                                previous
                                                            ) => ({
                                                                ...previous,
                                                                mobile: "",
                                                            })
                                                        );

                                                        setLookupError(
                                                            ""
                                                        );
                                                    }}
                                                    className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-white hover:text-slate-900"
                                                >
                                                    Change
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Existing loan status */}
                                    <div
                                        className={
                                            hasOutstanding
                                                ? "rounded-xl border border-amber-200 bg-amber-50 p-4"
                                                : "rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                                        }
                                    >
                                        <div className="flex items-start gap-3">
                                            {hasOutstanding ? (
                                                <AlertCircle
                                                    size={19}
                                                    className="mt-0.5 shrink-0 text-amber-600"
                                                />
                                            ) : (
                                                <CheckCircle2
                                                    size={19}
                                                    className="mt-0.5 shrink-0 text-emerald-600"
                                                />
                                            )}

                                            <div>
                                                <p
                                                    className={
                                                        hasOutstanding
                                                            ? "text-sm font-semibold text-amber-900"
                                                            : "text-sm font-semibold text-emerald-900"
                                                    }
                                                >
                                                    {hasOutstanding
                                                        ? "Existing outstanding loan"
                                                        : "No outstanding loan"}
                                                </p>

                                                {hasOutstanding && (
                                                    <p className="mt-1 text-sm text-amber-700">
                                                        Outstanding balance:{" "}
                                                        <span className="font-semibold">
                                                            KES{" "}
                                                            {outstanding.toLocaleString(
                                                                "en-KE",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Loan amount */}
                                    <InputField
                                        label="Loan Amount"
                                        type="number"
                                        name="amount"
                                        value={
                                            formData.amount
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter amount"
                                        min="1"
                                        step="0.01"
                                    />

                                    {/* Due date */}
                                    <InputField
                                        label="Loan Due Date"
                                        type="date"
                                        name="pay_date"
                                        value={
                                            formData.pay_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min={today}
                                        max={lastDate}
                                    />

                                    {/* Summary */}
                                    {formData.amount &&
                                        formData.pay_date && (
                                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                                <p className="mb-3 text-sm font-semibold text-slate-900">
                                                    Loan Summary
                                                </p>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between gap-4 text-sm">
                                                        <span className="text-slate-500">
                                                            Customer
                                                        </span>

                                                        <span className="truncate font-medium text-slate-900">
                                                            {getFullName(
                                                                customer
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-4 text-sm">
                                                        <span className="text-slate-500">
                                                            Amount
                                                        </span>

                                                        <span className="font-semibold text-slate-900">
                                                            KES{" "}
                                                            {Number(
                                                                formData.amount
                                                            ).toLocaleString(
                                                                "en-KE",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-4 text-sm">
                                                        <span className="text-slate-500">
                                                            Due date
                                                        </span>

                                                        <span className="font-medium text-slate-900">
                                                            {
                                                                formData.pay_date
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !customer ||
                                !formData.amount ||
                                !formData.pay_date
                            }
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading && (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            )}

                            {loading
                                ? "Assigning..."
                                : "Assign Loan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}