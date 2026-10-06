"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { createLoan } from "@/lib/api/loans";
import { useToast } from "../ui/ToastProvider";
import { Customer, fetchCustomers } from "@/lib/api/customers";

interface Props {
    customer_id?: string;
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}


export default function LoanModal({customer_id, open, onClose, onCreated }: Props) {
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError ] = useState("");
    const { showToast } = useToast();

    async function loadCustomers() {
            try {
                setLoading(true);
                setError("");
    
                const data = await fetchCustomers(search);
                setCustomers(data.customers);
    
            } catch (error) {
                setError(error instanceof Error ? error.message : "Unable to load customers.");
            } finally {
                setLoading(false);
            }
        }

    async function handleSubmit( event: FormEvent<HTMLFormElement> ) {
        event.preventDefault();
        setLoading(true);
        setError("");

        if (!customer_id) {
            customer_id = customers[0].id;
        }

        const form = new FormData(event.currentTarget);
        const payload = {
            customer_id: customer_id,
            principal: String(form.get("principal") ?? "").trim(),
            interest_rate: String(form.get("interest_rate") ?? "").trim(),
            due_date: String(form.get("due_date") ?? ""),
            loan_date: String(form.get("loan_date") ?? ""),
        };

        try {
            await createLoan(payload);
            onCreated();
            showToast("Loan issued successfully", "success");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to create loan.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(loadCustomers, 300);
        return () => clearTimeout(timer);
    }, [search]);

    console.log(customers[0]?.id)
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4">
            <div className="w-full max-h-[95vh] overflow-y-auto rounded-t-3xl bg-white sm:max-w-lg sm:rounded-2xl">
                <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Issue loan</h2>
                        <p className="text-sm text-slate-500">Create a new customer loan.</p>
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
                    {!customer_id && (
                        <div className="relative">
                            <label className="mb-2 block text-sm font-medium text-slate-700">Customer Details</label>
                            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)}
                                placeholder="Enter mobile or email..."
                                className="w-full rounded-xl border border-slate-200 text-left bg-slate-50 py-3 pl-2 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                    </div>
                    )}
                    <Field label="Principal amount" name="principal" type="number" required/>
                    <Field label="Interest rate (%)" name="interest_rate" type="number" step="0.01"/>
                    <Field label="Loan date" name="loan_date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required/>
                    <Field label="Due date" name="due_date" type="date" required/>
                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
                            {loading && (
                                <Loader2 size={17} className="animate-spin"/>
                            )}
                            {loading ? "Creating..." : "Issue loan"}
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