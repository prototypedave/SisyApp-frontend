"use client";

import { useState } from "react";
import { InputHTMLAttributes } from "react";
import { X } from "lucide-react";

interface EditModalProps {
    open: boolean;
    onClose: () => void;
}

interface InputFieldProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function PaymentSearchModal({ open, onClose,}: EditModalProps) {
    const [loading, setLoading] = useState(false);
    const [customerFound, setCustomerFound] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile: "",
        payment_id: "",
        loan_amount: "",
        balance: ""
    };
    const [formData, setFormData] = useState(initialFormData);

    if (!open) return null;
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetModal = () => {
        setCustomerFound(false);
        setSearchValue("");
        setFormData(initialFormData);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/get_payment/${formData.payment_id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                console.log(result.user);
                resetModal();
                onClose();
            } else {
                alert(result.message);
                console.log(result.errors);
            }
        } catch (error) {
            console.error(error);
            alert("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    const searchCustomer = async () => {
        if (!searchValue) return;
        setSearchLoading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/get_client/${searchValue}`
            );
            const result = await response.json();
            if (response.ok) {
                setFormData(result.client);
                setCustomerFound(true);
            } else {
                alert(result.message);
            }
        } finally {
            setSearchLoading(false);
        }

    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">       
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Find a payment record</h2>
                        <p className="mt-1 text-sm text-slate-500">Enter either ID, Transaction code or Mobile Number</p>
                    </div>
            
                    <button onClick={onClose} className="rounded-lg p-2 transition hover:bg-slate-100">
                        <X className="h-6 w-6 text-slate-600" />
                    </button>
                </div>
                {!customerFound ? (
                    <div className="p-8">
                        <h3 className="text-xl font-semibold text-slate-800">Search Customer</h3>
                        <p className="mt-1 text-sm text-slate-500">Enter either ID, Transaction code or Mobile Numbe.</p>
                        <div className="flex gap-4 mt-8">
                            <input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Enter ID Number or Mobile Number"
                                className="text-slate-700 flex-1 rounded-xl border border-slate-300 px-4 py-3"/>
                            <button onClick={searchCustomer} disabled={searchLoading}
                                className="rounded-xl bg-blue-600 px-6 text-white">
                                    {searchLoading ? "Searching..." : "Search"}
                                </button>
                        </div>
                    </div>
                ) : (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2 xl:grid-cols-3">
                        <InputField label="First Name" value={formData.first_name} name="first_name" onChange={handleChange} placeholder="First Name" />
                        <InputField label="Last Name" value={formData.last_name} name="last_name" onChange={handleChange} placeholder="Last Name" />
                        <InputField readOnly label="ID Number" value={formData.payment_id} name="id" onChange={handleChange} placeholder="ID Number" />
                        <InputField label="Mobile Number" value={formData.mobile} name="mobile" onChange={handleChange} placeholder="Mobile Number" />
                        <InputField label="Company" value={formData.loan_amount} name="company" onChange={handleChange} placeholder="Optional"/>
                        <InputField label="Alias" value={formData.balance} name="alias" onChange={handleChange} placeholder="Optional"/>
                    </div>

                <div className="sticky bottom-0 flex justify-end gap-4 border-t border-slate-200 bg-white px-8 py-5">
                    <button
                        type="button" onClick={onClose}
                        className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100">
                        Cancel
                    </button>
                    <button
                        type="submit" disabled={loading}
                        className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
                        {loading ? "Saving..." : "Save Customer"}
                    </button>
                </div>
                </form>
                )}
        
            </div>
         </div>
    );
}

function InputField({
  label,
  ...props
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="text-slate-700 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

