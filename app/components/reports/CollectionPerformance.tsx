"use client";

import {
    ArrowDownToLine,
    CircleDollarSign,
    Percent,
} from "lucide-react";

interface CollectionPerformanceProps {
    data: {
        collected: string;
        collection_rate: number;
    };
}

export default function CollectionPerformance({
    data,
}: CollectionPerformanceProps) {
    const collected = Number(data.collected);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div>
                <h2 className="text-base font-semibold text-slate-900">
                    Collection Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Track how effectively repayments are being collected.
                </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                        <ArrowDownToLine
                            size={18}
                            className="text-green-600"
                        />
                    </div>

                    <p className="mt-3 text-xs font-medium text-slate-500">
                        Collected
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                        KES{" "}
                        {collected.toLocaleString(
                            "en-KE",
                            {
                                maximumFractionDigits: 0,
                            }
                        )}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                        <Percent
                            size={18}
                            className="text-purple-600"
                        />
                    </div>

                    <p className="mt-3 text-xs font-medium text-slate-500">
                        Collection Rate
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                        {data.collection_rate}%
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                        Collection progress
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                        {data.collection_rate}%
                    </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                            width: `${Math.min(
                                Math.max(
                                    data.collection_rate,
                                    0
                                ),
                                100
                            )}%`,
                        }}
                    />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <CircleDollarSign size={14} />

                <span>
                    Collection rate is based on repayments
                    against the selected reporting period.
                </span>
            </div>
        </div>
    );
}