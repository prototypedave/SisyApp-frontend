"use client";

import { useEffect, useState } from "react";
import { Banknote, Plus } from "lucide-react";
import { fetchLoans, Loan } from "@/lib/api/loans";
import LoanModal from "@/app/components/loans/LoanModal";
import { useRouter } from "next/navigation";


export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    async function loadLoans() {
        try {
            setLoading(true);
            setError("");
            const data = await fetchLoans("ACTIVE");
            setLoans(data.loans);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to load loans.");
        } finally {
            setLoading(false);
        }
    }

    const openLoan = ( loan: Loan ) => {
        router.push(`/dashboard/loans/${loan.id}`);
    };

    useEffect(() => {
        loadLoans();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                        <Banknote size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Loans</h1>
                        <p className="text-sm text-slate-500">Manage active loans and repayments.</p>
                    </div>
                </div>
                <button type="button" onClick={() => setModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">
                    <Plus size={18} />
                    Issue loan
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Principal</th>
                                <th className="px-5 py-4">Interest</th>
                                <th className="px-5 py-4">Total due</th>
                                <th className="px-5 py-4">Balance</th>
                                <th className="px-5 py-4">Due</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">Loading loans...</td>
                                </tr>
                            ) : loans.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">No active loans.</td>
                                </tr>
                            ) : (
                                loans.map(
                                    (loan) => (
                                        <tr key={loan.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-slate-900">
                                                    { loan.customer.first_name }{" "}{ loan.customer.last_name }
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    { loan.customer.mobile }
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-700">KES{" "}{Number(loan.principal).toLocaleString()}</td>
                                            <td className="px-5 py-4 text-sm text-slate-700">{loan.interest_rate}%</td>
                                            <td className="px-5 py-4 text-sm font-medium text-slate-800">KES{" "}{Number(loan.total_due).toLocaleString()}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-900">KES{" "}{Number(loan.balance).toLocaleString()}</td>
                                            <td className={`px-5 py-4 text-sm ${loan.due_date <= new Date().toISOString().split("T")[0] ? "text-red-600 font-medium" : "text-blue-600"}`}>{loan.due_date}</td>
                                             <td className="px-5 py-4">
                                                <button type="button" onClick={() => openLoan( loan )} className="text-sm font-medium text-blue-700 hover:text-blue-900">View</button>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <LoanModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={() => {setModalOpen(false); loadLoans();}}
            />
        </div>
    );
}