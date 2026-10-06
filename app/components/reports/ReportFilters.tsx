"use client";

import { CalendarDays, FileBarChart, Loader2 } from "lucide-react";

interface ReportFiltersProps {
    fromDate: string;
    toDate: string;
    reportType: string;

    onFromDateChange: (value: string) => void;
    onToDateChange: (value: string) => void;
    onReportTypeChange: (value: string) => void;

    onGenerate: () => void;
    loading?: boolean;
}

export default function ReportFilters({
    fromDate,
    toDate,
    reportType,
    onFromDateChange,
    onToDateChange,
    onReportTypeChange,
    onGenerate,
    loading = false,
}: ReportFiltersProps) {
    return (
        <div
            className="
                rounded-2xl
                border border-slate-200
                bg-white
                p-4
                shadow-sm
                sm:p-5
            "
        >
            <div className="mb-4 flex items-center gap-2">
                <FileBarChart
                    size={18}
                    className="text-slate-500"
                />

                <h2 className="text-sm font-semibold text-slate-900">
                    Report Filters
                </h2>
            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    gap-3
                    md:grid-cols-2
                    xl:grid-cols-5
                "
            >
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        From
                    </label>

                    <div className="relative">
                        <CalendarDays
                            size={16}
                            className="
                                pointer-events-none
                                absolute left-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) =>
                                onFromDateChange(
                                    e.target.value
                                )
                            }
                            className="
                                h-11 w-full
                                rounded-xl
                                border border-slate-200
                                bg-white
                                pl-10 pr-3
                                text-sm
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        To
                    </label>

                    <div className="relative">
                        <CalendarDays
                            size={16}
                            className="
                                pointer-events-none
                                absolute left-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) =>
                                onToDateChange(
                                    e.target.value
                                )
                            }
                            className="
                                h-11 w-full
                                rounded-xl
                                border border-slate-200
                                bg-white
                                pl-10 pr-3
                                text-sm
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        Report Type
                    </label>

                    <select
                        value={reportType}
                        onChange={(e) =>
                            onReportTypeChange(
                                e.target.value
                            )
                        }
                        className="
                            h-11 w-full
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
                        <option value="portfolio">
                            Portfolio Performance
                        </option>

                        <option value="loans">
                            Loan Report
                        </option>

                        <option value="payments">
                            Collection Report
                        </option>

                        <option value="customers">
                            Customer Report
                        </option>

                        <option value="overdue">
                            Overdue Loans
                        </option>
                    </select>
                </div>

                <div className="md:col-span-2 xl:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-transparent">
                        Generate
                    </label>

                    <button
                        type="button"
                        onClick={onGenerate}
                        disabled={loading}
                        className="
                            flex h-11 w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-4
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {loading ? (
                            <>
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                                Generating...
                            </>
                        ) : (
                            "Generate Report"
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {[
                    {
                        label: "This Month",
                        days: "month",
                    },
                    {
                        label: "Last Month",
                        days: "last-month",
                    },
                    {
                        label: "Last 3 Months",
                        days: "3-months",
                    },
                ].map((preset) => (
                    <button
                        key={preset.days}
                        type="button"
                        className="
                            rounded-lg
                            border border-slate-200
                            px-3 py-1.5
                            text-xs
                            font-medium
                            text-slate-600
                            transition
                            hover:bg-slate-50
                        "
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );
}