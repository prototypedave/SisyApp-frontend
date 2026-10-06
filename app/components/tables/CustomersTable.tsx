"use client";

import {
    ChevronRight,
    MoreHorizontal,
    Pencil,
    Archive,
    UserX,
    Users,
    Eye,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
    Customer,
    getFullName,
    getInitials,
} from "../Utils";

interface CustomersTableProps {
    search: string;
    status: string;
    loanStatus: string;

    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
    onBlacklist: (customer: Customer) => void;
}

export default function CustomersTable({
    search,
    status,
    loanStatus,
    onEdit,
    onDelete,
    onBlacklist,
}: CustomersTableProps) {

    const router = useRouter();
    const { data: customers = [], isLoading, isError, } = useQuery<Customer[]>({
        queryKey: ["customers"],
        queryFn: async () => {
            const response = await fetch("/api/customers", { cache: "no-store", });
            if (!response.ok) {
                throw new Error("Failed to load customers");
            }

            return response.json();
        },
        refetchOnWindowFocus: true,
    });

    const normalize = (value: string | undefined | null) => {
        return String(value ?? "")
            .toLowerCase()
            .trim();
    };

    const formatCurrency = ( value: string | number | undefined | null ) => {
        const amount = Number(value ?? 0);
        return `KES ${amount.toLocaleString("en-KE", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        })}`;
    };

    const getLoanStatusLabel = ( customer: Customer) => {
        const value = normalize( customer.status);
        if (value === "active") {
            return "Active";
        }

        if (value === "overdue") {
            return "Overdue";
        }
        return "No Active Loan";
    };

    const filteredCustomers = customers.filter(
        (customer) => {
            const searchValue = normalize(search);
            const fullName = [
                customer.first_name,
                customer.middle_name,
                customer.last_name,
            ]
                .filter(Boolean)
                .join(" ");

            const matchesSearch =
                !searchValue ||
                normalize(fullName).includes(searchValue) ||
                normalize(customer.id).includes(searchValue) ||
                normalize(customer.mobile).includes(searchValue);

            const customerStatus = normalize(
                customer.status || "Active"
            );

            const selectedStatus = normalize(status);

            const matchesStatus =
                selectedStatus === "" ||
                selectedStatus === "all" ||
                customerStatus === selectedStatus;

            const customerLoanStatus = getLoanStatusLabel(customer);
            const selectedLoanStatus = normalize(loanStatus);
            let matchesLoanStatus = true;
            if ( selectedLoanStatus && selectedLoanStatus !== "all" ) {
                if ( selectedLoanStatus === "no active loan" ) {
                    matchesLoanStatus = customerLoanStatus === "No Active Loan";
                } else {
                    matchesLoanStatus = normalize( customerLoanStatus ) === selectedLoanStatus;
                }
            }
            return ( matchesSearch && matchesStatus && matchesLoanStatus
            );
        }
    );

    const openCustomer = ( customer: Customer ) => {
        router.push(
            `/dashboard/customers/${customer.id}`
        );
    };

    const statusClass = ( customerStatus?: string ) => {
        switch (normalize(customerStatus)) {
            case "blacklisted":
                return "bg-red-50 text-red-700";
            case "archived":
                return "bg-slate-100 text-slate-600";
            default:
                return "bg-green-50 text-green-700";
        }
    };

    const loanStatusClass = ( customerLoanStatus?: string ) => {
        switch (normalize(customerLoanStatus)) {
            case "overdue":
                return "bg-red-50 text-red-700";
            case "active":
                return "bg-blue-50 text-blue-700";
            default:
                return "bg-slate-100 text-slate-600";
        }
    };
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(
                        (item) => (
                            <div key={item} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                        )
                    )}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-[300px] items-center justify-center p-6">
                <div className="text-center">
                    <p className="font-medium text-slate-900"> Unable to load customers</p>
                    <p className="mt-1 text-sm text-slate-500"> Please try again.</p>
                </div>
            </div>
        );
    }

    if (!filteredCustomers.length) {
        return (
            <div className="flex min-h-[300px] items-center justify-center p-6">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <Users size={22} className="text-slate-400"/>
                    </div>
                    <p className="mt-3 font-medium text-slate-900"> No customers found</p>
                    <p className="mt-1 text-sm text-slate-500"> Try changing your search or filters.</p>
                </div>

            </div>
        );
    }

    return (
        <>
            <div className="divide-y divide-slate-100 md:hidden">
                {filteredCustomers.map(
                    (customer) => {
                        const customerLoanStatus = getLoanStatusLabel( customer );
                        return (
                            <div key={customer.id} className="flex items-center gap-3 p-4">
                                <button type="button" onClick={() => openCustomer( customer )} className="flex min-w-0 flex-1 items-center gap-3 text-left" >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">{getInitials( customer )}</div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-900">{getFullName( customer )}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">{customer.mobile} </p>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${loanStatusClass( customerLoanStatus )}`}>{customerLoanStatus}</span>
                                            <span className="text-xs text-slate-400">{customer.active_loans ?? 0}{" "} {Number( customer.active_loans ?? 0 ) === 1 ? "loan" : "loans"} </span>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="shrink-0 text-slate-400" />
                                </button>

                                <div className="relative">
                                    <details className="group">
                                        <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" onClick={(event) => event.stopPropagation() }>
                                            <MoreHorizontal size={20} />
                                        </summary>
                                        <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg" onClick={(event) => event.stopPropagation() }>
                                            <button type="button" onClick={() => onEdit( customer )} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                                                <Pencil size={16} />
                                                Edit customer
                                            </button>
                                            <button type="button" onClick={() => onBlacklist( customer )} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                                                <UserX size={16} />
                                                {customer.status === "Blacklisted" ? "Remove blacklist" : "Blacklist customer"}
                                            </button>
                                            <button type="button" onClick={() => onDelete( customer )} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50" >
                                                <Archive size={16}/>
                                                Archive customer
                                            </button>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        );
                    }
                )}
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"> Customer</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"> Contact </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"> Active Loans</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"> Outstanding </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"> Next Payment </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"> Loan Status </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"> Customer Status</th>
                            <th className="px-6 py-4" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredCustomers.map(
                            (customer) => {
                                const customerLoanStatus = getLoanStatusLabel( customer );
                                return (
                                    <tr key={customer.id} onClick={() => openCustomer( customer )} className="cursor-pointer transition hover:bg-slate-50" >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">{getInitials( customer )} </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{getFullName( customer )} </p>
                                                    <p className="mt-0.5 text-xs text-slate-500">ID:{" "} { customer.id }</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{customer.mobile}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-900">{customer.active_loans ?? 0} </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-slate-900">{formatCurrency( customer.outstanding )} </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600">{customer.next_payment ?? "—"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${loanStatusClass( customerLoanStatus )}`}>{ customerLoanStatus } </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass( customer.status )}`}> {customer.status ?? "Active"} </span>
                                        </td>
                                        <td className="px-6 py-4" onClick={(event) => event.stopPropagation() }>
                                            <div className="flex items-center justify-end gap-1">
                                                <button type="button" title="View customer" onClick={() => openCustomer( customer )} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                                                    <Eye size={17}/>
                                                </button>
                                                <details className="group relative">
                                                    <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                                                        <MoreHorizontal size={18}/>
                                                    </summary>
                                                    <div className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg" onClick={(event) => event.stopPropagation()}>
                                                        <button type="button" onClick={() => onEdit( customer )} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                                                            <Pencil size={16}/>
                                                            Edit customer
                                                        </button>
                                                        <button type="button" onClick={() => onBlacklist( customer )} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                                                            <UserX size={16}/>
                                                            {customer.status === "Blacklisted" ? "Remove blacklist" : "Blacklist customer"}
                                                        </button>
                                                        <button type="button" onClick={() => onDelete( customer )} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                                                            <Archive size={16}/>
                                                            Archive customer
                                                        </button>
                                                    </div>
                                                </details>
                                                <button type="button" title="Open customer" onClick={() => openCustomer( customer )} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" >
                                                    <ChevronRight size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        )}

                    </tbody>

                </table>

            </div>
        </>
    );
}