"use client";

import {
    CalendarDays,
    Download,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

interface LoanToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;

    status: string;
    onStatusChange: (value: string) => void;

    dueDate: string;
    onDueDateChange: (value: string) => void;
}

export default function LoanToolbar({
    search,
    onSearchChange,
    status,
    onStatusChange,
    dueDate,
    onDueDateChange,
}: LoanToolbarProps) {
    const clearFilters = () => {
        onSearchChange("");
        onStatusChange("all");
        onDueDateChange("all");
    };

    const hasFilters =
        search.trim() !== "" ||
        status !== "all" ||
        dueDate !== "all";

    return (
        <div className="border-b border-slate-100 p-4 sm:p-5 lg:p-6">

            {/* Search */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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
                            onSearchChange(event.target.value)
                        }
                        placeholder="Search by customer, loan ID or mobile..."
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

                <div className="grid grid-cols-2 gap-3 sm:flex">
                    {/* Status */}
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
                            value={status}
                            onChange={(event) =>
                                onStatusChange(event.target.value)
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
                                sm:w-40
                            "
                        >
                            <option value="all">
                                All Status
                            </option>
                            <option value="active">
                                Active
                            </option>
                            <option value="due-today">
                                Due Today
                            </option>
                            <option value="due-soon">
                                Due Soon
                            </option>
                            <option value="overdue">
                                Overdue
                            </option>
                            <option value="completed">
                                Completed
                            </option>
                        </select>
                    </div>

                    {/* Due date */}
                    <div className="relative">
                        <CalendarDays
                            size={16}
                            className="
                                pointer-events-none
                                absolute left-3 top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <select
                            value={dueDate}
                            onChange={(event) =>
                                onDueDateChange(event.target.value)
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
                                sm:w-40
                            "
                        >
                            <option value="all">
                                All Dates
                            </option>
                            <option value="today">
                                Today
                            </option>
                            <option value="tomorrow">
                                Tomorrow
                            </option>
                            <option value="next-7-days">
                                Next 7 Days
                            </option>
                            <option value="this-month">
                                This Month
                            </option>
                        </select>
                    </div>
                </div>

                {/* Clear filters */}
                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="
                            flex h-11
                            items-center justify-center gap-2
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
                        items-center justify-center gap-2
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