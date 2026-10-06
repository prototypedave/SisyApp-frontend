"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

interface PortfolioData {
    month: string;
    issued: number;
    repayments: number;
    outstanding: number;
}

interface PortfolioResponse {
    data: PortfolioData[];
    summary: {
        issued: number;
        repayments: number;
        outstanding: number;
    };
}

const formatKES = (value: number) => {
    if (value >= 1_000_000) {
        return `KES ${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
        return `KES ${(value / 1_000).toFixed(0)}K`;
    }

    return `KES ${value.toLocaleString("en-KE")}`;
};

const tooltipFormatter = (value: unknown) => {
    if (value === undefined || value === null) {
        return "";
    }

    return `KES ${Number(value).toLocaleString(
        "en-KE"
    )}`;
};

export default function PortfolioChart() {
    const [months, setMonths] = React.useState("6");
    const { data, isLoading, isFetching, isError, refetch,} = useQuery<PortfolioResponse>({
        queryKey: ["portfolio", months,],
        queryFn: async () => {
            const response = await fetch(
                `/api/dashboard/portfolio?months=${months}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    cache: "no-store",
                }
            );

            const result =await response.json();

            if (!response.ok) {
                throw new Error(result?.message || "Unable to load portfolio data.");
            }

            return result;
        },

        refetchOnWindowFocus: true,
        retry: 2,
        staleTime: 30 * 1000,
    });

    const chartData = data?.data ?? [];
    const summary = data?.summary ?? {
            issued: 0,
            repayments: 0,
            outstanding: 0,
        };

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Loan Portfolio</h2>
                        {isFetching && (
                            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" title="Updating"/>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Issued, collected and outstanding</p>
                </div>

                <select aria-label="Portfolio time period" value={months} onChange={(event) => setMonths(event.target.value)}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:px-3 sm:text-sm">
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                </select>
            </div>

            {isError && (
                <div className="flex items-center justify-between gap-3 border-b border-red-100 bg-red-50 px-4 py-3 sm:px-5">
                    <p className="text-xs text-red-700">Unable to update portfolio data.</p>
                    <button type="button" onClick={() => refetch()} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">Retry</button>
                </div>
            )}

            <div className="grid grid-cols-3 border-b border-slate-100">
                <div className="px-3 py-4 sm:px-5">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">Issued</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800 sm:text-base">{isLoading ? "—" : formatKES(summary.issued)}</p>
                </div>
                <div className="border-l border-slate-100 px-3 py-4 sm:px-5">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">Collected</p>
                    <p
                        className="mt-1 text-sm font-semibold text-slate-800 sm:text-base">{isLoading ? "—" : formatKES(summary.repayments)}</p>
                </div>
                <div className="border-l border-slate-100 px-3 py-4 sm:px-5">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">Outstanding</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800 sm:text-base">{isLoading ? "—" : formatKES(summary.outstanding)}</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-[280px] items-center justify-center px-4 pb-4 pt-5 sm:h-[320px] lg:h-[350px]">
                    <div className="w-full">
                        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                        <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-50" />
                    </div>
                </div>
            ) : (
                <div className="h-[280px] w-full px-2 pb-4 pt-5 sm:h-[320px] sm:px-4 sm:pb-5 lg:h-[350px] lg:px-5">
                    {chartData.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-600">No portfolio data</p>
                                <p className="mt-1 text-xs text-slate-400">There is no data for this period.</p>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{top: 5, right: 8, left: 0, bottom: 5,}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                                <XAxis dataKey="month" tick={{fill: "#64748b", fontSize: 12,}} axisLine={false} tickLine={false}/>
                                <YAxis tickFormatter={formatKES} tick={{fill: "#64748b", fontSize: 11,}} axisLine={false} tickLine={false} width={65}/>
                                <Tooltip
                                    formatter={tooltipFormatter} contentStyle={{borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)", fontSize: "12px",}}/>
                                <Line type="monotone" dataKey="issued" name="Loans Issued" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{r: 5,}}/>
                                <Line type="monotone" dataKey="repayments" name="Collected" stroke="#16a34a" strokeWidth={2.5} dot={false} activeDot={{r: 5,}}/>
                                <Line type="monotone" dataKey="outstanding" name="Outstanding" stroke="#f97316" strokeWidth={2.5} dot={false} activeDot={{r: 5,}}/>
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            )}
            <div
                className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 px-4 py-3 sm:px-5">
                <LegendItem color="bg-blue-600" label="Issued"/>
                <LegendItem color="bg-green-600" label="Collected"/>
                <LegendItem color="bg-orange-500" label="Outstanding"/>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/* Legend                                                                     */
/* -------------------------------------------------------------------------- */

function LegendItem({
    color,
    label,
}: {
    color: string;
    label: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={`h-2 w-2 rounded-full ${color}`}
            />

            <span className="text-xs text-slate-500">
                {label}
            </span>
        </div>
    );
}

