"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Plus, Banknote, UserCheck, User } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";
import { MoreHorizontal } from "lucide-react";
import { blacklistCustomer, archiveCustomer, UnblacklistCustomer, Customer } from "@/lib/api/customers";
import EditCustomerModal from "../customers/EditCustomerModal";


export function RecordPaymentButton({
    onClick,
}: {
    onClick: () => void;
}) {
    return (
        <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:flex-none" onClick={onClick}>
            <Banknote size={17} />
            Record Payment
        </button>
    );
}

export function AssignLoanButton({ onClick, blacklisted }: { onClick: () => void; blacklisted?: boolean }) {
    return (
        <button type="button" disabled={blacklisted} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:flex-none" onClick={onClick}>
            <Plus size={17} />
            Issue Loan
        </button>
    );
}

export function UnBlacklistButton({customer_id, onRefresh }: { customer_id: string, onRefresh: () => Promise<void>; }) {
    const [open, setOpen] = useState(false);
    const { showToast } = useToast();

    async function handleUnblacklist() {
        try {
            const data = await UnblacklistCustomer(customer_id);
            setOpen(false);
            if (data) {
                showToast(data.message);
            }
            await onRefresh();
        } catch (error) {
            console.error("Failed to blacklist customer:", error);
            showToast("Failed to blacklist customer");
        }
    }
    return (
        <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:flex-none" onClick={handleUnblacklist}>
            <UserCheck size={17} />
            Unblacklist Customer
        </button>
    );
}


export default function LogoutButton() {
    const router = useRouter();
    const [ loading, setLoading, ] = useState(false);
    async function handleLogout() {
        setLoading(true);
        try {
            const csrfResponse =
                await fetch("/api/auth/csrf");

            if (!csrfResponse.ok) {
                throw new Error("Unable to obtain security token.");
            }

            const { token } = await csrfResponse.json();
            const response = await fetch("/api/auth/logout",
                {
                    method: "POST",
                    headers: {
                            "X-CSRF-Token": token,
                        },
                    }
                );

            if (!response.ok) {
                throw new Error("Logout failed.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            router.replace("/login");
            router.refresh();
        }
    }
    return (
        <button
            type="button" onClick={handleLogout} disabled={loading} className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 disabled:opacity-50">
            {loading ? (
                <Loader2 size={18} className="animate-spin"/>
            ) : (
                <LogOut size={18} />
            )}
            {loading ? "Signing out..." : "Sign out"}
        </button>
    );
}


export function ActionsMenu({ customer, onRefresh, }: { customer: Customer, onRefresh: () => Promise<void>; }) {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    
    async function handleBlacklist() {
        try {
            setLoading(true);
            const payload = {
                reason: "Unpaid dues"
            }

            const data = await blacklistCustomer(customer.id, payload);
            setOpen(false);
            if (data) {
                showToast(data.message);
            }
            await onRefresh();
        } catch (error) {
            console.error("Failed to blacklist customer:", error);
            showToast("error");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    async function handleArchive() {
        try {
            await archiveCustomer(customer.id);
            setOpen(false);

           await onRefresh();
        } catch (error) {
            console.error("Failed to archive customer:", error);
        }
    }

    function handleEditClose() {
        setEditOpen(false);
        onRefresh();
    }

    return (
        <div className="relative">
            <button type="button" onClick={() => setOpen((prev) => !prev)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                <MoreHorizontal size={20} />
            </button>

            {open && (
                <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    <button type="button" disabled={customer.blacklisted} className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={handleBlacklist}>
                        {customer.blacklisted ? "Unblacklist Customer" : "Blacklist Customer"}
                    </button>
                    <button type="button" disabled={customer.blacklisted} className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => {
                            setEditOpen(true);
                            setOpen(false);
                        }}
                    >
                        Edit Customer
                    </button>

                    <button
                        type="button"
                        className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                        onClick={handleArchive}
                    >
                        Archive Customer
                    </button>
                </div>
            )}
            <EditCustomerModal open={editOpen} onClose={handleEditClose} customer={customer} />
        </div>
    );
}