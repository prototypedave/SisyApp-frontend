"use client";

import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface PortfolioTrendData {
    month: string;
    issued: number;
    collected: number;
    outstanding: number;
}

interface PortfolioTrendProps {
    data: PortfolioTrendData[];
}

function formatCurrency(value: number) {
    if (value >= 1_000_000) {
        return `KES ${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
        return `KES ${(value / 1_000).toFixed(0)}K`;
    }

    return `KES ${value}`;
}

export default function PortfolioTrend({
    data,
}: PortfolioTrendProps) {
    return (
        <div
            className="
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-sm
            "
        >
            <div className="border-b border-slate-200 p-4 sm:p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Portfolio Performance
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Issued, collected and outstanding amounts
                            over time.
                        </p>
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                        Last 6 months
                    </span>
                </div>
            </div>

            <div className="h-[300px] p-3 sm:h-[360px] sm:p-5">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={65}
                            tick={{ fontSize: 11 }}
                            tickFormatter={formatCurrency}
                        />

                        <Tooltip
                            formatter={(value) =>
                                formatCurrency(
                                    Number(value)
                                )
                            }
                        />

                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="issued"
                            name="Issued"
                            strokeWidth={2}
                            dot={false}
                        />

                        <Line
                            type="monotone"
                            dataKey="collected"
                            name="Collected"
                            strokeWidth={2}
                            dot={false}
                        />

                        <Line
                            type="monotone"
                            dataKey="outstanding"
                            name="Outstanding"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}