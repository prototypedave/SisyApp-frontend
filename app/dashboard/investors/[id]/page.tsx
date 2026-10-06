"use client";

import { useEffect, useState } from "react";
import { Investor, Payment, fetchInvestor, fetchPayments } from "@/lib/api/investors";
import { ArrowLeft, CreditCard, ChevronRight, User, Wallet, Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import PaymentModal from "@/app/components/investors/PaymentModal";
import { formatDate, formatDateTime, formatKES } from "@/app/components/Utils";

function Info({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="border-b border-slate-100 px-5 py-4 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
        </div>
    );
}

export default function CustomerDetailsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [investor, setLoan] = useState<Investor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [loanModalOpen, setLoanModalOpen] = useState(false);
    const [totalPaid, setTotalPayed] = useState(0.0);
    const [hasBalance, setHasBalance] = useState(false);

    const router = useRouter();
    const params = useParams<{ id: string }>();
    const loanId = Array.isArray(params.id) ? params.id[0] : params.id;
    const totalLoan = Number(investor?.principal ?? 0) + Number(investor?.interest_amount ?? 0);
    const totalPaidAmount = Number(totalPaid ?? 0);

    async function loadLoan() {
        try {
            setError("");
            if (!loanId) {
                setError("Investor ID is missing.");
                return;
            }
            const data = await fetchInvestor(loanId);
            setLoan(data);
            const balance = Number(data.balance ?? 0);
            setHasBalance(balance > 0);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to load loans.");
        } finally {
            setLoading(false);
        }
    }

    async function loadPayments() {
        try {
            setLoading(true);
            setError("");
            if (!loanId) {
                setError("Investor ID is missing.");
                setPayments([]);
                return;
            }
            const data = await fetchPayments(loanId);
            setPayments(data.payments);
            setTotalPayed(data.payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0));
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to load loans.");
        } finally {
            setLoading(false);
        }
    }

    async function refreshLoanPage() {
        await Promise.all([
            loadLoan(),
            loadPayments(),
        ]);
    }

    useEffect(() => {
        loadLoan();
        const timer = setTimeout(loadPayments, 300);
        return () => clearTimeout(timer);
    }, [loanId]);

    const handlePayment = () => {
        setPaymentModalOpen(true);
    };

    const openPayment = (payment: Payment) => {
        router.push(`/dashboard/payments/${payment.id}`);
    };

    const openLoan = (loanItem: Investor) => {
        router.push(`/dashboard/loans/${loanItem.id}`);
    };

    return (
        <div className="mx-auto w-full max-w-7xl">
            <button type="button" onClick={() => router.push("/dashboard/investors")} className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                <ArrowLeft size={17} />
                Investors
            </button>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Wallet size={20} className="text-blue-600"/>
                        <p className="text-sm font-medium text-slate-500">Investor Details</p>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{"Investment no: "}{investor?.id}</h1>
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${investor?.status === "PAID" ? "border-green-100 bg-green-50 text-green-700" : "border-blue-100 bg-blue-50 text-blue-700"}`}>{investor?.status}</span>
                    </div>
                </div>

                {hasBalance && (
                    <button type="button" onClick={handlePayment} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                        <CreditCard size={17} />
                        Record Payment
                    </button>
                )}
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Outstanding Balance</p>
                                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{formatKES(investor?.balance ?? 0)}</p>
                            </div>
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <Wallet size={23} />
                            </div>
                        </div>

                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-blue-600 transition-all"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(0, (Number(totalPaid) / Number(totalLoan)) * 100)
                                    )}%`,
                                }}
                            />
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500">{formatKES(totalPaid)}{" "}paid</span>
                            <span className="font-medium text-slate-700">{Number(totalLoan) > 0 ? Math.round((Number(totalPaid) / Number(totalLoan)) * 100) : 0}%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
                        <div className="px-5 py-5 sm:px-6">
                            <p className="text-xs text-slate-400">Principal</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{formatKES(investor?.principal ?? 0)}</p>
                        </div>
                        <div className="px-5 py-5 sm:px-6">
                            <p className="text-xs text-slate-400">Interest</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{formatKES(investor?.interest_amount ?? 0)}</p>
                        </div>
                        <div className="border-t border-slate-100 px-5 py-5 sm:border-t-0 sm:px-6">
                            <p className="text-xs text-slate-400">Total Investor</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{formatKES(totalLoan)}</p>
                        </div>

                        <div className="border-t border-slate-100 px-5 py-5 sm:border-t-0 sm:px-6">
                            <p className="text-xs text-slate-400">Paid</p>
                            <p className="mt-1 text-sm font-semibold text-green-600">{formatKES(totalPaid)}</p>
                        </div>
                    </div>
                </section>
            </div>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                    <h2 className="text-base font-semibold text-slate-900">Investor Information</h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5">
                    <Info label="Created" value={formatDateTime(investor?.created_at ?? undefined)}/>
                    <Info label="Due Date" value={formatDate(investor?.due_date ?? undefined)}/>
                    <Info label="Principal" value={formatKES(investor?.principal ?? 0)}/>
                    <Info label="Interest" value={formatKES(investor?.interest_amount ?? 0)}/>
                </div>
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="font-semibold text-slate-900">Payments</h2>
                        <p className="mt-0.5 text-xs text-slate-500">{payments.length}{" "} {payments.length === 1 ? "investor" : "loans"}{" "}recorded</p>
                    </div>
                    <button type="button" disabled={hasBalance ? false : true } onClick={() => setPaymentModalOpen(true) } className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                        <Plus size={18} />
                    </button>
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
                                    <th className="px-5 py-4">Payment ID</th>
                                    <th className="px-5 py-4">Amount</th>
                                    <th className="px-5 py-4">Payment Date</th>
                                    <th className="px-5 py-4">Payment Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">Loading Loans...</td>
                                    </tr>
                                ) : payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">No loans found.</td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                            <td className="px-5 py-4 text-slate-600">{payment.payment_number}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{formatKES(payment.amount)}</td>
                                            <td className="px-5 py-4 text-sm font-medium text-slate-800">{formatDate(payment.payment_date)}</td>
                                            <td className="px-5 py-4">
                                                {payment.payment_method === "M-Pesa" ? (
                                                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">{payment.payment_method}</span>
                                                ) : payment.payment_method === "Bank" ? (
                                                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">{payment.payment_method}</span>
                                                ) : (
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{payment.payment_method ?? "N/A"}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </section>
             <PaymentModal
                open={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                loanId={loanId}
                onCreated={refreshLoanPage}
            />
        </div>
    );
}