"use client";

import { useEffect, useState } from "react";
import { Customer, fetchCustomer } from "@/lib/api/customers";
import { Loan, fetchLoans } from "@/lib/api/loans";
import {
    ArrowLeft,
    MoreHorizontal,
    CalendarDays,
    CreditCard,
    Wallet,
    CircleDollarSign,
    CheckCircle2,
    Clock3,
    Plus,
} from "lucide-react";

import { useRouter, useParams } from "next/navigation";
import { ActionsMenu, AssignLoanButton, RecordPaymentButton, UnBlacklistButton } from "@/app/components/ui/Buttons";
import LoanModal from "@/app/components/loans/LoanModal";
import PaymentModal from "@/app/components/payments/PaymentModal";
import { formatDate, formatKES } from "@/app/components/Utils";

export default function CustomerDetailsPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loanStatus, setLoanStatus] = useState("ACTIVE");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const params = useParams<{ id: string; }>();
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [loanModalOpen, setLoanModalOpen] = useState(false);
    const [totalBorrowed, setTotalBorrowed] = useState(0.0);
    const [outstandingBalance, setOutstandingBalance] = useState(0.0);
    const [totalPaid, setTotalPaid] = useState(0.0);
    const [lastPaid, setLastPaid] = useState(0.0);
    const customerId = Array.isArray(params.id) ? params.id[0] : params.id;
    const activeLoans = loans.filter((loan) => loan.status === "ACTIVE");
    const hasOutstandingLoan = activeLoans.length > 0;
    const outstandingLoanId = activeLoans[0]?.id ?? 0;
    const router = useRouter();

    async function loadCustomer() {
        try {
            setError("");
            if (!customerId) {
                setError("Customer ID is missing.");
                return;
            }
            const data = await fetchCustomer(customerId);
            setCustomer(data)

         } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to load loans.");
        } finally {
            setLoading(false);
        }
    }

    async function loadLoans() {
        try {
            setLoading(true);
            setError("");
            if (!customerId) {
                setError("Customer ID is missing.");
                setLoans([]);
                return;
            }
            const data = await fetchLoans(loanStatus, customerId);
            setLoans(data.loans);
            setTotalBorrowed(data.loans.reduce((sum, loan) => sum + Number(loan.principal ?? 0), 0));

            setOutstandingBalance(
                data.loans
                    .filter((loan) => loan.status === "ACTIVE")
                    .reduce(
                        (sum, loan) => sum + Number(loan.balance ?? 0),
                        0
                    )
            );
            if (loanStatus === "ACTIVE" && data.loans.length == 0) {
                setLoanStatus("");
            }

            const firstLoan = data.loans[0];
            setTotalPaid(
                firstLoan
                    ? Number(firstLoan.total_due ?? 0) - Number(firstLoan.balance ?? 0)
                    : 0
            );

         } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to load loans.");
        } finally {
            setLoading(false);
        }
    }
    
    async function refreshCustomerPage() {
        await Promise.all([
            loadCustomer(),
            loadLoans(),
        ]);
    }
    const getInitials =  `${customer?.first_name?.[0] ?? ""}${customer?.last_name?.[0] ?? ""}`.toUpperCase();

    useEffect(() => {
        loadCustomer();
        const timer = setTimeout(loadLoans, 300);
        return () => clearTimeout(timer);
    }, [loanStatus, customerId]);

    const openLoan = ( loan: Loan ) => {
        router.push(`/dashboard/loans/${loan.id}`);
    };


    return (
        <main className="min-h-full">
            <div className="mx-auto w-full max-w-[1400px]">
                <button type="button" onClick={() => router.push("/dashboard/customers")} className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                    <ArrowLeft size={17} />
                    Customers
                </button>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-700">{getInitials}</div>
                            <div className="min-w-0">
                                <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{customer?.first_name}{" "}{customer?.last_name}</h1>
                                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
                                    <span>ID: {customer?.id}</span>
                                    <span>{customer?.mobile}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {hasOutstandingLoan ? (
                                <RecordPaymentButton onClick={() => setPaymentModalOpen(true)} />
                            ) : customer?.blacklisted ? (
                                <UnBlacklistButton customer_id={customerId} onRefresh={loadCustomer} />
                            ) : (
                                <AssignLoanButton onClick={() => setLoanModalOpen(true)} blacklisted={customer?.blacklisted} />
                            )}

                            {customer && <ActionsMenu customer={customer} onRefresh={loadCustomer} />}
                        </div>
                    </div>
                </section>
                <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-slate-500">Outstanding</p>
                            <CircleDollarSign size={18} className="text-slate-400"/>
                        </div>
                        <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">{formatKES(outstandingBalance)}</p>
                        <p className="mt-1 text-xs text-slate-500"> Current balance </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-slate-500">Active Loans</p>
                            <CreditCard size={18} className="text-slate-400"/>
                        </div>
                        <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">{activeLoans.length}</p>
                        <p className="mt-1 text-xs text-slate-500">{activeLoans.length === 1 ? "Active loan" : "Active loans"}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-slate-500">Total Borrowed</p>
                            <Wallet size={18} className="text-slate-400"/>
                        </div>
                        <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">{formatKES(totalBorrowed)}</p>
                        <p className="mt-1 text-xs text-slate-500">Across all loans</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-slate-500">Last Payment</p>
                            <CalendarDays size={18} className="text-slate-400"/>
                        </div>
                        <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">{hasOutstandingLoan ? "KES 0" : formatKES(loans[0]?.total_due ?? 0)}</p>
                        <p className="mt-1 text-xs text-slate-500"> {hasOutstandingLoan ? "No payments yet" : formatDate(loans[0]?.completion_date ?? undefined)}</p>
                    </div>
                </section>
                <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <div>
                            <h2 className="font-semibold text-slate-900">Loans</h2>
                            <p className="mt-0.5 text-xs text-slate-500">{loans.length}{" "} {loans.length === 1 ? "loan" : "loans"}{" "}recorded</p>
                        </div>
                        <button type="button" disabled={hasOutstandingLoan ? false : true } onClick={() => setLoanModalOpen(true) } className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
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
                                        <th className="px-5 py-4">Loan ID</th>
                                        <th className="px-5 py-4">Amount</th>
                                        <th className="px-5 py-4">Loan Date</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Completion / Due Date</th>
                                        <th className="px-5 py-4">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">Loading Loans...</td>
                                        </tr>
                                    ) : loans.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">No loans found.</td>
                                        </tr>
                                    ) : (loans.map((loan) => (
                                        <tr key={loan.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                            <td className="px-5 py-4 text-slate-600">{loan.loan_number}</td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{formatKES(loan.total_due)}</td>
                                            <td className="px-5 py-4 text-sm font-medium text-slate-800">{loan.loan_date}</td>
                                            <td className="px-5 py-4">
                                                {loan.status === "ACTIVE" ? (
                                                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">{loan.status}</span>
                                                ) : (
                                                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">{loan.status}</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                               {loan.status === "ACTIVE" ? (
                                                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">{loan.due_date}</span>
                                                ) : (
                                                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">{loan.completion_date}</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <button type="button" onClick={() => openLoan( loan )} className="text-sm font-medium text-blue-700 hover:text-blue-900">View</button>
                                            </td>
                                        </tr>
                                        ))
                                    )}
                                </tbody>
                         </table>
                        </div>
                    </div>
                </section>
                <LoanModal
                    customer_id={customer?.id}
                    open={loanModalOpen}
                    onClose={() => setLoanModalOpen(false)}
                    onCreated={refreshCustomerPage}
                />
                <PaymentModal
                    open={paymentModalOpen}
                    onClose={() => setPaymentModalOpen(false)}
                    loanId={outstandingLoanId}
                    onCreated={refreshCustomerPage}
                />
            </div>
        </main>
    );
}


