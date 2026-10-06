"use client";

import { useEffect, useState } from "react";
import { Banknote, Plus } from "lucide-react";
import { fetchInvestors, Investor } from "@/lib/api/investors";
import InvestmentModal from "@/app/components/investors/InvestmentModal";
import { useRouter } from "next/navigation";


export default function InvestorsPage() {
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    async function loadInvestors() {
        try {
            setLoading(true);
            setError("");
            const data = await fetchInvestors("ACTIVE");
            console.log(data);
            setInvestors(data.investors);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to load investors.");
        } finally {
            setLoading(false);
        }
    }

    const openInvestor = ( investor: Investor ) => {
        router.push(`/dashboard/investors/${investor.id}`);
    };

    useEffect(() => {
        loadInvestors();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                        <Banknote size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Investors</h1>
                        <p className="text-sm text-slate-500">See active investments made in your company</p>
                    </div>
                </div>
                <button type="button" onClick={() => setModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">
                    <Plus size={18} />
                    Add Investment
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
                                <th className="px-5 py-4">Investor</th>
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
                                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">Loading investors data...</td>
                                </tr>
                            ) : investors?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">No active investor.</td>
                                </tr>
                            ) : (
                                investors?.map(
                                    (investor) => (
                                        <tr key={investor.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-slate-900">
                                                    { investor.first_name }{" "}{ investor.last_name }
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    { investor.mobile }
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-700">KES{" "}{Number(investor.principal).toLocaleString()}</td>
                                            <td className="px-5 py-4 text-sm text-slate-700">{investor.interest_rate}%</td>
                                            <td className="px-5 py-4 text-sm font-medium text-slate-800">KES{" "}{Number(investor.total_due).toLocaleString()}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-900">KES{" "}{Number(investor.balance).toLocaleString()}</td>
                                            <td className={`px-5 py-4 text-sm ${investor.due_date <= new Date().toISOString().split("T")[0] ? "text-red-600 font-medium" : "text-blue-600"}`}>{investor.due_date}</td>
                                             <td className="px-5 py-4">
                                                <button type="button" onClick={() => openInvestor( investor )} className="text-sm font-medium text-blue-700 hover:text-blue-900">View</button>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <InvestmentModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={() => {setModalOpen(false); loadInvestors();}}
            />
        </div>
    );
}