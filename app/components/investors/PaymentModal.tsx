"use client";

import { FormEvent, useState } from "react";
import { Loader2, X } from "lucide-react";
import { recordPayment } from "@/lib/api/investors";
import { useToast } from "../ui/ToastProvider";

interface Props {
    loanId: number;
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}


export default function PaymentModal({ loanId, open, onClose, onCreated }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError ] = useState("");
    const { showToast } = useToast();

    if (!open) {
        return null;
    }

    async function handleSubmit( event: FormEvent<HTMLFormElement> ) {
        event.preventDefault();
        setLoading(true);
        setError("");

        const form = new FormData(event.currentTarget);
        const payload = {
            amount: Number(form.get("amount") ?? ""),
            payment_date: String(form.get("payment_date") ?? "").trim(),
            payment_method: String(form.get("payment_method") ?? "").trim(),
            payment_number: String(form.get("payment_number") ?? "").trim(),
            reference: String(form.get("reference") ?? ""),
            notes: String(form.get("notes") ?? ""),
        };


        try {
            await recordPayment(Number(loanId), payload);
            onCreated();
            showToast("Payment recorded successfully", "success");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to record payment.");
            showToast(error instanceof Error ? error.message : "Unable to record payment");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4">
            <div className="w-full max-h-[95vh] overflow-y-auto rounded-t-3xl bg-white sm:max-w-lg sm:rounded-2xl">
                <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Record Payment</h2>
                        <p className="text-sm text-slate-500">Clear customer loan</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 p-5">
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <Field label="Amount Paid" name="amount" type="number" required/>
                    <Field label="Payment Date" name="payment_date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required/>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Payment Method</label>
                        <select name="payment_method" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-700">
                            <option value="M-Pesa">M-Pesa</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank</option>
                        </select>
                    </div>
                    <Field label="Payment number or account" name="payment_number"/>
                    <Field label="Reference Code" name="reference"/>
                    <Field label="Notes" name="notes" />
                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
                            {loading && (
                                <Loader2 size={17} className="animate-spin"/>
                            )}
                            {loading ? "Recording..." : "Pay loan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface FieldProps {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    defaultValue?: string;
    step?: string;
}


function Field({ label, name, type = "text", required = false, defaultValue, step }: FieldProps) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
            <input name={name} type={type} required={required} defaultValue={ defaultValue} step={step} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-500"/>
        </div>
    );
}