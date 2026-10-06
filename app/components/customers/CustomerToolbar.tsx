"use client";

import {
    Search,
    X,
    Download,
} from "lucide-react";

interface CustomerToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;

    status: string;
    onStatusChange: (value: string) => void;

    loanStatus: string;
    onLoanStatusChange: (value: string) => void;
}

export default function CustomerToolbar({
    search,
    onSearchChange,
    status,
    onStatusChange,
    loanStatus,
    onLoanStatusChange,
}: CustomerToolbarProps) {
    const hasFilters =
        search ||
        status !== "all" ||
        loanStatus !== "all";

    const clearFilters = () => {
        onSearchChange("");
        onStatusChange("all");
        onLoanStatusChange("all");
    };

    return (
        <div className="border-b border-slate-200 p-4 sm:p-5">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

                {/* Search */}
                <div className="relative min-w-0 flex-1">
                    <Search
                        size={18}
                        className="
                            pointer-events-none
                            absolute left-3 top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            onSearchChange(e.target.value)
                        }
                        placeholder="Search by name, ID or mobile..."
                        className="
                            h-11 w-full
                            rounded-xl
                            border border-slate-200
                            bg-slate-50
                            pl-10 pr-4
                            text-sm
                            text-slate-900
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:border-blue-500
                            focus:bg-white
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-3 sm:flex">

                    <select
                        value={status}
                        onChange={(e) =>
                            onStatusChange(e.target.value)
                        }
                        className="
                            h-11
                            min-w-0
                            rounded-xl
                            border border-slate-200
                            bg-white
                            px-3
                            text-sm
                            text-slate-700
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >
                        <option value="all">
                            All Customers
                        </option>
                        <option value="active">
                            Active
                        </option>
                        <option value="blacklisted">
                            Blacklisted
                        </option>
                        <option value="archived">
                            Archived
                        </option>
                    </select>

                    <select
                        value={loanStatus}
                        onChange={(e) =>
                            onLoanStatusChange(
                                e.target.value
                            )
                        }
                        className="
                            h-11
                            min-w-0
                            rounded-xl
                            border border-slate-200
                            bg-white
                            px-3
                            text-sm
                            text-slate-700
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >
                        <option value="all">
                            All Loans
                        </option>
                        <option value="active">
                            Active Borrowers
                        </option>
                        <option value="overdue">
                            Overdue
                        </option>
                        <option value="none">
                            No Active Loan
                        </option>
                    </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2">

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="
                                flex h-11
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border border-slate-200
                                px-3
                                text-sm
                                font-medium
                                text-slate-600
                                transition
                                hover:bg-slate-50
                            "
                        >
                            <X size={16} />
                            <span className="hidden sm:inline">
                                Clear
                            </span>
                        </button>
                    )}

                    <button
                        type="button"
                        className="
                            flex h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border border-slate-200
                            px-3
                            text-sm
                            font-medium
                            text-slate-600
                            transition
                            hover:bg-slate-50
                        "
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">
                            Export
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}