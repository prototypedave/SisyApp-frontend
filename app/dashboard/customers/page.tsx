"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { Customer, fetchCustomers } from "@/lib/api/customers";
import CustomerModal from "@/app/components/customers/CustomerModal";
import { useRouter } from "next/navigation";


export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

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

    const openCustomer = ( customer: Customer ) => {
        router.push(`/dashboard/customers/${customer.id}`);
    };


    useEffect(() => {
        const timer = setTimeout(loadCustomers, 300);
        return () => clearTimeout(timer);

    }, [search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                            <Users size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
                            <p className="text-sm text-slate-500">Manage your customers and loan eligibility.</p>
                        </div>
                    </div>
                </div>
                <button type="button" onClick={() => setModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800">
                    <Plus size={18} />
                    Add customer
                </button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input type="search" value={search} onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name, mobile or email..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Mobile</th>
                                <th className="px-5 py-4">Loan limit</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">Loading customers...</td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">No customers found.</td>
                                </tr>
                            ) : (
                                customers.map(
                                    (customer) => (
                                        <tr key={customer.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-slate-900">
                                                    {customer.first_name}{" "}
                                                    {customer.last_name}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    ID: {customer.id}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{customer.mobile}</td>
                                            <td className="px-5 py-4 text-sm font-medium text-slate-800">KES{" "}{Number(customer.loan_limit).toLocaleString()}</td>
                                            <td className="px-5 py-4">
                                                {customer.blacklisted ? (
                                                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Blacklisted</span>
                                                ) : (
                                                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <button type="button" onClick={() => openCustomer( customer )} className="text-sm font-medium text-blue-700 hover:text-blue-900">View</button>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <CustomerModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={() => {
                    setModalOpen(false);
                    loadCustomers();
                }}
            />
        </div>
    );
}