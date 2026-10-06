"use client";

import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    ChevronDown,
    Loader2,
    Search,
    UserRound,
    X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Customer, getFullName, Loan } from "../Utils";
import { useToast } from "@/app/components/ui/ToastProvider";

interface PaymentModalProps {
    open: boolean;
    customer?: Customer | null;
    loanId?: number | null;
    onClose: () => void;
}

interface CustomerLookupResponse {
    customer: Customer;
    summary?: {
        active_loans?: number;
        outstanding?: string;
    };
    loans?: Loan[];
}

interface FormData {
    mobile: string;
    loan_id: string;
    amount: string;
    pay_date: string;
    method: "M-pesa" | "Cash" | "Bank";
}

export default function PaymentModal({ open, customer: initialCustomer = null, loanId: initialLoanId = null, onClose, }: PaymentModalProps) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [lookingUp, setLookingUp] = useState(false);
    const [customer, setCustomer] = useState<Customer | null>(initialCustomer);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [lookupError, setLookupError] = useState("");
    const [formData, setFormData] = useState<FormData>({
        mobile: initialCustomer?.mobile ?? "",
        loan_id: initialLoanId ? String(initialLoanId) : "",
        amount: "",
        pay_date: "",
        method: "M-pesa",
    });
    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        if (!open) {
            return;
        }
        setCustomer(initialCustomer ?? null);
        setFormData({
            mobile: initialCustomer?.mobile ?? "",
            loan_id: initialLoanId ? String(initialLoanId) : "",
            amount: "",
            pay_date: "",
            method: "M-pesa",
        });

        setLookupError("");
        setLookingUp(false);
        setLoading(false);
    }, [ open, initialCustomer?.id, initialCustomer?.mobile, initialLoanId, ]);

    useEffect(() => {
        if (!open || !initialCustomer?.id) {
            return;
        }
        loadCustomerLoans( initialCustomer.id );
    }, [ open, initialCustomer?.id, ]);

    const loadCustomerLoans = async ( customerId: string ) => {
        try {
            const response = await fetch(
                `/api/customers/${encodeURIComponent(customerId)}/loans`,
                {
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error( "Failed to load customer loans" );
            }

            const result: Loan[] = await response.json();
            const activeLoans = result.filter(
                (loan: Loan) =>
                    !loan.paid &&
                    Number(loan.balance) > 0
            );

            setLoans(activeLoans);

            if ( !initialLoanId && activeLoans.length === 1) {
                const loan = activeLoans[0];
                setFormData((previous) => ({
                    ...previous,
                    loan_id: String(loan.id),
                }));
            }

            if (initialLoanId) {
                const selectedLoan = activeLoans.find( (loan) => loan.id === initialLoanId );
                if (selectedLoan) {
                    setFormData(
                        (previous) => ({
                            ...previous,
                            loan_id: String( selectedLoan.id ),
                        })
                    );
                }
            }
        } catch (error) {
            console.error(
                "Failed to load customer loans:",
                error
            );

            setLoans([]);
        }
    };

    const handleCustomerLookup = async () => {
        const mobile = formData.mobile.trim();
        if (!mobile) {
            setLookupError( "Enter a mobile number." );
            return;
        }
        setLookingUp(true);
        setLookupError("");
        setCustomer(null);
        setLoans([]);
        try {
            const response = await fetch( `/api/customers/lookup?mobile=${encodeURIComponent( mobile )}`,
                {
                    cache: "no-store",
                }
            );

            const result = await response.json();
            if (!response.ok) {
                setLookupError( result.message || "Customer not found." );
                return;
            }
            const foundCustomer = result.customer;
            setCustomer( foundCustomer );
            setFormData( 
                (previous) => ({
                ...previous,
                mobile: foundCustomer.mobile, })
            );
                
            const activeLoans: Loan[] = ( result.loans ?? [] ).filter(
                (loan: Loan) => !loan.paid && Number( loan.balance ) > 0
            );
            setLoans(activeLoans);
            if ( activeLoans.length === 1 ) {
                setFormData(
                    (previous) => ({
                    ...previous,
                    loan_id: String( activeLoans[0].id),
                })
            );}
        } catch (error) {
            console.error(
                "Customer lookup failed:",
                error
            );

            setLookupError( "Unable to connect to the server.");
        } finally {
            setLookingUp(false);
        }
    };

    const selectedLoan = useMemo(() => {
        if (!formData.loan_id) {
            return null;
        }

        return (
            loans.find( (loan) =>
                String(loan.id) ===
                formData.loan_id
            ) ?? null
        );
    }, [ loans, formData.loan_id, ]);

  
    const maximumPayment = selectedLoan ? Number(selectedLoan.balance) : 0;

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement > ) => {
        const { name, value, } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (name === "loan_id") {
            setFormData((previous) => ({
                ...previous,
                loan_id: value,
                amount: "",
            }));
        }
    };

    const handlePayFullBalance = () => {
        if (!selectedLoan) {
            return;
        }

        setFormData((previous) => ({
            ...previous,
            amount: selectedLoan.balance,
        }));
    };

    const handleMobileKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) => {
        if ( e.key === "Enter" && !customer ) {
            e.preventDefault();
            handleCustomerLookup();
        }
    };

    const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        if (!customer) {
            showToast( "Select a customer first.", "error" );
            return;
        }

        if (!selectedLoan) {
            showToast( "Select an outstanding loan.", "error" );
            return;
        }

        const amount = Number(formData.amount);
        if ( !formData.amount || Number.isNaN(amount) || amount <= 0 ) {
            showToast( "Enter a valid payment amount.", "error" );
            return;
        }

        if ( amount > maximumPayment ) {
            showToast( "Payment cannot exceed the outstanding balance.", "error" );
            return;
        }

        if (!formData.pay_date) {
            showToast( "Select the payment date.", "error" );
            return;
        }

        if ( selectedLoan.created_at && formData.pay_date < selectedLoan.created_at.slice( 0, 10 ) ) {
            showToast( "Payment date cannot be before the loan date.", "error" );
            return;
        }

        setLoading(true);
        try {
            const response = await fetch( "/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({
                        loan_id: selectedLoan.id,
                        client_id: customer.id,
                        amount: formData.amount,
                        pay_date: formData.pay_date,
                        method: formData.method,
                }),
            });
            const result = await response.json();
            console.log( "HTTP status:", response.status );
            console.log( "Backend response:", result );

            if (!response.ok) {
                showToast( result.message || "Unable to record payment.", "error" );
                return;
            }

            showToast( "Payment recorded successfully.", "success" );

            await Promise.all([ 
                queryClient.invalidateQueries({ queryKey: [ "customer", customer.id,],}),
                queryClient.invalidateQueries({ queryKey: [ "customers", ],}),
                queryClient.invalidateQueries({ queryKey: [ "customerSummary",],}),
                queryClient.invalidateQueries({ queryKey: ["loans"], }),
                queryClient.invalidateQueries({ queryKey: [ "actionableLoans", ], }),
                queryClient.invalidateQueries({ queryKey: [ "payments", ], }),
                queryClient.invalidateQueries({ queryKey: [ "dashboard", ], }),
                queryClient.invalidateQueries({ queryKey: [ "portfolio", ], }),
                queryClient.invalidateQueries({ queryKey: [ "activities",], }),
            ]);
            onClose();
        } catch (error) {
            console.error( "Payment failed:", error);
            showToast( "Unable to connect to the server.", "error" );
        } finally {
            setLoading(false);
        }
    };

    if (!open) {
        return null;
    }

    const noOutstandingLoans = customer && loans.length === 0;
    const paymentAmount = Number(formData.amount) || 0;
    const remainingBalance = Math.max( maximumPayment - paymentAmount, 0 );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation() }>
                <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900"> Record Payment </h2>
                        <p className="mt-1 text-sm text-slate-500">  Record a payment against an outstanding loan. </p>
                    </div>
                    <button type="button" onClick={onClose} disabled={loading} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" >
                    <div className="overflow-y-auto p-5 sm:p-6">
                        <div className="space-y-5">
                            {!customer ? (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700"> Customer Mobile Number </label>
                                    <div className="flex gap-2">
                                        <input type="tel" name="mobile" value={ formData.mobile } onChange={ handleChange } onKeyDown={ handleMobileKeyDown }
                                            placeholder="0712 345 678" autoComplete="tel" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
                                        <button type="button" onClick={ handleCustomerLookup } disabled={ lookingUp || !formData.mobile.trim() } className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                                            {lookingUp ? (
                                                <Loader2 size={17} className="animate-spin" />
                                            ) : (
                                                <Search size={17}/>
                                            )}
                                            <span className="hidden sm:inline">{lookingUp ? "Searching..." : "Find"} </span>
                                        </button>
                                    </div>

                                    {lookupError && (
                                        <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                            <span>{ lookupError }</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700"> Customer </label>
                                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                                {customer.first_name?.[0]}
                                                {customer.last_name?.[0]}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-semibold text-slate-900"> {getFullName( customer )} </p>
                                                    <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                                                </div>

                                                <p className="mt-0.5 text-xs text-slate-500">{ customer.mobile } {" • "} ID:{" "} { customer.id } </p>
                                            </div>
                                            {!initialCustomer && (
                                                <button type="button" onClick={() => { setCustomer( null );
                                                    setLoans( [] );
                                                    setFormData(( previous ) => ({
                                                        ...previous,
                                                        mobile: "",
                                                        loan_id: "",
                                                        amount: "",
                                                    }));
                                                    setLookupError( "" );
                                                }}
                                                className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-white hover:text-slate-900">
                                                    Change
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {noOutstandingLoans ? (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                                <UserRound size={20} className="text-slate-500" />
                                            </div>
                                            <p className="mt-3 text-sm font-semibold text-slate-900"> No outstanding loans </p>
                                            <p className="mt-1 text-sm text-slate-500"> This customer currently has no loan balance to receive a payment.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700"> Loan </label>
                                                {loans.length === 1 ? (
                                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-900"> Loan LN00{loans[0].id} </p>
                                                                <p className="mt-1 text-xs text-slate-500"> Due{" "} { loans[0].pay_date } </p>
                                                            </div>

                                                            <div className="text-right">
                                                                <p className="text-xs text-slate-500"> Balance</p>
                                                                <p className="text-sm font-bold text-slate-900"> KES{" "} {Number( loans[0].balance).toLocaleString(
                                                                    "en-KE",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    } )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <select name="loan_id" value={ formData.loan_id } onChange={ handleChange } className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" >
                                                            <option value=""> Select loan </option>
                                                            {loans.map( ( loan ) => (
                                                                <option key={ loan.id } value={ loan.id } > Loan LN00 { loan.id }{" "} — KES{" "} {Number( loan.balance ).toLocaleString( "en-KE" )}{" "} outstanding </option>
                                                            ))}
                                                        </select>

                                                        <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                                                    </div>
                                                )}
                                            </div>

                                            {selectedLoan && (
                                                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900"> Outstanding Balance </p>
                                                            <p className="mt-1 text-xs text-slate-500"> Loan LN00{ selectedLoan.id } </p>
                                                        </div>
                                                        <p className="text-lg font-bold text-blue-700"> KES{" "} {maximumPayment.toLocaleString( "en-KE",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-700"> Payment Amount </label>
                                                    {selectedLoan && (
                                                        <button type="button" onClick={ handlePayFullBalance } className="text-xs font-semibold text-blue-600 hover:text-blue-700"> Pay full balance</button>
                                                    )}
                                                </div>
                                            
                                                <div className="relative">
                                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">KES </span>
                                                    <input type="number" name="amount" value={ formData.amount } onChange={ handleChange } placeholder="0.00" min="0.01" max={ maximumPayment || undefined }
                                                        step="0.01" disabled={ !selectedLoan }
                                                        className="w-full rounded-xl border border-slate-300 py-3 pl-14 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="payment_method" className="mb-2 block text-sm font-medium text-slate-700">Payment Method</label>
                                                <div className="relative">
                                                    <select id="payment_method" name="payment_method" value={formData.method} onChange={handleChange} disabled={!selectedLoan}
                                                        className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50">
                                                        <option value="M-Pesa">M-Pesa</option>
                                                        <option value="Cash">Cash</option>
                                                        <option value="Bank">Bank</option>
                                                    </select>
                                                    <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                                                </div>
                                            </div>

                                            {/* Payment date */}
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700">Payment Date</label>
                                                <input type="date" name="pay_date" value={ formData.pay_date } onChange={ handleChange }
                                                    min={ selectedLoan?.created_at ? selectedLoan.created_at.slice( 0, 10 ) : undefined }
                                                    max={ today }
                                                    disabled={ !selectedLoan }
                                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                                />
                                            </div>

                                            {selectedLoan && formData.amount && (
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-500"> Remaining after payment </span>
                                                            <span className="font-bold text-slate-900"> KES{" "} {remainingBalance.toLocaleString( "en-KE",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                })}
                                                            </span>
                                                        </div>

                                                        {remainingBalance === 0 && (
                                                            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
                                                                <CheckCircle2 size={ 16 } />
                                                                Loan will be fully paid.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                        <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={ loading || !customer || !selectedLoan || !formData.amount || !formData.pay_date } className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                            {loading && (
                                <Loader2 size={17} className="animate-spin" />
                            )}
                            {loading ? "Recording..." : "Record Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}