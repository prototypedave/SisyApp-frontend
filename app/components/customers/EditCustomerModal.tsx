"use client";

import { FormEvent, useEffect, useState } from "react";
import { InputHTMLAttributes } from "react";
import { Loader2, X } from "lucide-react";
import { Customer, updateCustomer } from "@/lib/api/customers";
import { useToast } from "../ui/ToastProvider";

interface EditCustomerModalProps {
    open: boolean;
    onClose: () => void;
    customer: Customer | null;
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {label: string;}

export default function EditCustomerModal({ open, onClose, customer }: EditCustomerModalProps) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({first_name: "", last_name: "", mobile: "", salary: "", other_mobile: "", email: ""});
    const { showToast } = useToast();
     
    useEffect(() => {
        if (!customer || !open) {
            return;
        }
        setFormData({
            first_name: customer.first_name ?? "",
            last_name: customer.last_name ?? "",
            mobile: customer.mobile ?? "",
            salary: customer.salary ?? "",
            other_mobile: customer.other_mobile ?? "",
            email: customer.email ?? "",
        });
    }, [customer, open]);

    if (!open || !customer) {
        return null;
    }

    async function handleSubmit( event: FormEvent<HTMLFormElement> ) {
            event.preventDefault();
            setLoading(true);
            setError("");

            if (!customer?.id) {
                showToast("Customer not found.", "error");
                setLoading(false);
                return;
            }
    
            const form = new FormData(event.currentTarget);
            const payload = {
                first_name: String(form.get("first_name") ?? "").trim(),
                last_name: String(form.get("last_name") ?? "").trim(),
                other_mobile: String(form.get("other_mobile") ?? "").trim() || null,
                email: String(form.get("email") ?? "").trim() || null,
                salary: String(form.get("salary") ?? "").trim() || null,
            };
    
            try {
                await updateCustomer(customer.id, payload);
                showToast("Customer Updated Successfully");
                onClose();
    
            } catch (error) {
                setError(error instanceof Error ? error.message : "Unable to create customer.");
                showToast(error instanceof Error ? error.message : "Unable to update customer",  "error");
    
            } finally {
                setLoading(false);
            }
        }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4">
            <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl">
                <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Add customer</h2>
                        <p className="text-sm text-slate-500">Create a new customer record.</p>
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
    
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="First name" name="first_name" required defaultValue={formData.first_name}/>
                        <Field label="Last name" name="last_name" required defaultValue={formData.last_name}/>                   
                        <Field label="Other mobile" name="other_mobile" type="tel" defaultValue={formData.other_mobile}/>
                        <Field label="Email" name="email" type="email" defaultValue={formData.email}/>
                        <Field label="Monthly salary" name="salary" type="number" defaultValue={formData.salary}/>
                    </div>
                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
                            {loading && (
                                <Loader2 size={17} className="animate-spin"/>
                            )}
    
                            {loading ? "Making changes..." : "Edit customer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({
    label,
    name,
    type = "text",
    required = false,
    defaultValue,
}: {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    defaultValue?: string;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>
            <input name={name} type={type} required={required} defaultValue={defaultValue} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-700"/>
        </div>
    );
}