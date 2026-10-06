"use client";

import {
    ArrowLeft,
    Database,
    Download,
    FileSpreadsheet,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DataSettings() {
    const router = useRouter();

    const exports = [
        {
            title: "Customers",
            description:
                "Export your customer records.",
            endpoint: "/customers/export",
        },
        {
            title: "Loans",
            description:
                "Export loan and outstanding balance data.",
            endpoint: "/loans/export",
        },
        {
            title: "Payments",
            description:
                "Export payment and repayment history.",
            endpoint: "/payments/export",
        },
        {
            title: "Reports",
            description:
                "Export generated reports.",
            endpoint: "/reports/export",
        },
    ];

    const handleExport = (
        endpoint: string
    ) => {
        const base =
            process.env.NEXT_PUBLIC_API_URL;

        window.open(
            `${base}${endpoint}`,
            "_blank"
        );
    };

    return (
        <main className="min-h-full">
            <div className="mx-auto w-full max-w-[900px]">

                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/dashboard/settings"
                            )
                        }
                        className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                    >
                        <ArrowLeft size={17} />
                        Settings
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                            <Database
                                size={21}
                                className="text-slate-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                Data & Reports
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Export your SisyLoan business data.
                            </p>
                        </div>
                    </div>
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {exports.map((item) => (
                        <div
                            key={item.title}
                            className="flex items-center justify-between gap-4 border-b border-slate-100 p-4 last:border-b-0 sm:p-5"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                                    <FileSpreadsheet
                                        size={19}
                                        className="text-slate-600"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        {item.title}
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    handleExport(
                                        item.endpoint
                                    )
                                }
                                className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">
                                    Export
                                </span>
                            </button>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}