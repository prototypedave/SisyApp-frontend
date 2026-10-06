"use client";

import {
    Download,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

interface PaymentToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;

    paymentMethod: string;
    onPaymentMethodChange: (value: string) => void;
}

export default function PaymentToolbar({
    search,
    onSearchChange,
    paymentMethod,
    onPaymentMethodChange,
}: PaymentToolbarProps) {
    const hasFilters =
        search.trim() !== "" ||
        paymentMethod !== "all";

    const clearFilters = () => {
        onSearchChange("");
        onPaymentMethodChange("all");
    };

    return (
        <div className="border-b border-slate-100 p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

                {/* Search */}
                <div className="relative min-w-0 flex-1">
                    <Search
                        size={18}
                        className="
                            pointer-events-none
                            absolute left-3.5 top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            onSearchChange(
                                event.target.value
                            )
                        }
                        placeholder="Search customer, payment ID, loan ID or mobile..."
                        className="
                            h-11 w-full
                            rounded-xl
                            border border-slate-200
                            bg-slate-50
                            pl-10 pr-4
                            text-sm
                            text-slate-800
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:border-blue-400
                            focus:bg-white
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    />
                </div>

                {/* Payment method */}
                <div className="relative">
                    <SlidersHorizontal
                        size={16}
                        className="
                            pointer-events-none
                            absolute left-3 top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <select
                        value={paymentMethod}
                        onChange={(event) =>
                            onPaymentMethodChange(
                                event.target.value
                            )
                        }
                        className="
                            h-11 w-full
                            appearance-none
                            rounded-xl
                            border border-slate-200
                            bg-white
                            pl-9 pr-8
                            text-sm
                            font-medium
                            text-slate-700
                            outline-none
                            transition
                            focus:border-blue-400
                            focus:ring-2
                            focus:ring-blue-100
                            sm:w-44
                        "
                    >
                        <option value="all">
                            All Methods
                        </option>

                        <option value="mpesa">
                            M-Pesa
                        </option>

                        <option value="cash">
                            Cash
                        </option>

                        <option value="bank">
                            Bank
                        </option>

                        <option value="other">
                            Other
                        </option>
                    </select>
                </div>

                {/* Clear */}
                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="
                            flex h-11
                            items-center justify-center
                            gap-2
                            rounded-xl
                            px-3
                            text-sm font-medium
                            text-slate-500
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                        "
                    >
                        <X size={16} />

                        <span className="hidden sm:inline">
                            Clear
                        </span>
                    </button>
                )}

                {/* Export */}
                <button
                    type="button"
                    className="
                        flex h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border border-slate-200
                        bg-white
                        px-4
                        text-sm font-medium
                        text-slate-700
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
    );
}