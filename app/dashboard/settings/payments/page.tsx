"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Check,
    CreditCard,
    Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

const paymentMethods = [
    {
        id: "mpesa",
        label: "M-Pesa",
        description: "Record mobile money repayments.",
    },
    {
        id: "cash",
        label: "Cash",
        description: "Record cash repayments.",
    },
    {
        id: "bank",
        label: "Bank",
        description: "Record bank transfers or deposits.",
    },
    {
        id: "other",
        label: "Other",
        description: "Record other payment methods.",
    },
];

export default function PaymentSettings() {
    const router = useRouter();

    const [methods, setMethods] = useState({
        mpesa: true,
        cash: true,
        bank: true,
        other: true,
    });

    const [partialPayments, setPartialPayments] =
        useState(true);

    const [earlyRepayment, setEarlyRepayment] =
        useState(true);

    const [autoComplete, setAutoComplete] =
        useState(true);

    const [saving, setSaving] = useState(false);

    const toggleMethod = (
        method: keyof typeof methods
    ) => {
        setMethods((current) => ({
            ...current,
            [method]: !current[method],
        }));
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            // PATCH /settings/payments
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-full">
            <div className="mx-auto w-full max-w-[900px]">

                <PageHeader
                    router={router}
                    title="Payment Settings"
                    description="Configure repayment methods and payment behaviour."
                />

                <div className="space-y-6">

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 p-4 sm:p-5">
                            <h2 className="text-base font-semibold text-slate-900">
                                Payment Methods
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Choose the payment methods available when recording repayments.
                            </p>
                        </div>

                        {paymentMethods.map((method) => (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() =>
                                    toggleMethod(
                                        method.id as keyof typeof methods
                                    )
                                }
                                className="flex w-full items-center justify-between gap-4 border-b border-slate-100 p-4 text-left last:border-b-0 hover:bg-slate-50 sm:p-5"
                            >
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {method.label}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {method.description}
                                    </p>
                                </div>

                                <div
                                    className={`
                                        flex h-6 w-6
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-md
                                        border
                                        ${
                                            methods[
                                                method.id as keyof typeof methods
                                            ]
                                                ? "border-blue-600 bg-blue-600"
                                                : "border-slate-300 bg-white"
                                        }
                                    `}
                                >
                                    {methods[
                                        method.id as keyof typeof methods
                                    ] && (
                                        <Check
                                            size={15}
                                            className="text-white"
                                        />
                                    )}
                                </div>
                            </button>
                        ))}
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 p-4 sm:p-5">
                            <h2 className="text-base font-semibold text-slate-900">
                                Repayment Rules
                            </h2>
                        </div>

                        <ToggleRow
                            title="Allow Partial Payments"
                            description="Allow customers to repay only part of their outstanding balance."
                            checked={partialPayments}
                            onChange={
                                setPartialPayments
                            }
                        />

                        <ToggleRow
                            title="Allow Early Repayment"
                            description="Allow customers to repay before the scheduled due date."
                            checked={earlyRepayment}
                            onChange={
                                setEarlyRepayment
                            }
                        />

                        <ToggleRow
                            title="Automatically Complete Paid Loans"
                            description="Mark a loan as completed when its balance reaches zero."
                            checked={autoComplete}
                            onChange={setAutoComplete}
                        />
                    </section>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            <Save size={17} />
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

function PageHeader({
    router,
    title,
    description,
}: {
    router: ReturnType<typeof useRouter>;
    title: string;
    description: string;
}) {
    return (
        <div className="mb-6">
            <button
                type="button"
                onClick={() =>
                    router.push("/dashboard/settings")
                }
                className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
                <ArrowLeft size={17} />
                Settings
            </button>

            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
                    <CreditCard
                        size={21}
                        className="text-purple-600"
                    />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        {title}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ToggleRow({
    title,
    description,
    checked,
    onChange,
}: {
    title: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-4 last:border-b-0 sm:p-5">
            <div>
                <p className="text-sm font-medium text-slate-900">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    {description}
                </p>
            </div>

            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    checked
                        ? "bg-blue-600"
                        : "bg-slate-200"
                }`}
            >
                <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                        checked
                            ? "left-[22px]"
                            : "left-0.5"
                    }`}
                />
            </button>
        </div>
    );
}