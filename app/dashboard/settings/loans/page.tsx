"use client";

import { useState } from "react";
import {
    ArrowLeft,
    CircleDollarSign,
    Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoanSettings() {
    const router = useRouter();

    const [settings, setSettings] = useState({
        interestRate: "10",
        minimumAmount: "1000",
        maximumAmount: "100000",
        defaultTerm: "30",
        gracePeriod: "0",
        multipleActiveLoans: true,
        requireApproval: true,
    });

    const [saving, setSaving] = useState(false);

    const update = (
        field: keyof typeof settings,
        value: string | boolean
    ) => {
        setSettings((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            // PATCH /settings/loans
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-full">
            <div className="mx-auto w-full max-w-[900px]">

                <PageHeader
                    router={router}
                    title="Loan Settings"
                    description="Configure your default lending rules."
                />

                <div className="space-y-6">

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 p-4 sm:p-5">
                            <h2 className="text-base font-semibold text-slate-900">
                                Loan Defaults
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                These values can be used as defaults when creating loans.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 sm:p-5">

                            <Input
                                label="Default Interest Rate (%)"
                                type="number"
                                value={settings.interestRate}
                                onChange={(value) =>
                                    update(
                                        "interestRate",
                                        value
                                    )
                                }
                            />

                            <Input
                                label="Default Loan Term (days)"
                                type="number"
                                value={settings.defaultTerm}
                                onChange={(value) =>
                                    update(
                                        "defaultTerm",
                                        value
                                    )
                                }
                            />

                            <Input
                                label="Minimum Loan Amount"
                                type="number"
                                value={settings.minimumAmount}
                                onChange={(value) =>
                                    update(
                                        "minimumAmount",
                                        value
                                    )
                                }
                            />

                            <Input
                                label="Maximum Loan Amount"
                                type="number"
                                value={settings.maximumAmount}
                                onChange={(value) =>
                                    update(
                                        "maximumAmount",
                                        value
                                    )
                                }
                            />

                            <Input
                                label="Grace Period (days)"
                                type="number"
                                value={settings.gracePeriod}
                                onChange={(value) =>
                                    update(
                                        "gracePeriod",
                                        value
                                    )
                                }
                            />
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 p-4 sm:p-5">
                            <h2 className="text-base font-semibold text-slate-900">
                                Lending Rules
                            </h2>
                        </div>

                        <ToggleRow
                            title="Allow Multiple Active Loans"
                            description="Allow a customer to have more than one unpaid loan."
                            checked={
                                settings.multipleActiveLoans
                            }
                            onChange={(value) =>
                                update(
                                    "multipleActiveLoans",
                                    value
                                )
                            }
                        />

                        <ToggleRow
                            title="Require Loan Approval"
                            description="Require confirmation before a requested loan is disbursed."
                            checked={
                                settings.requireApproval
                            }
                            onChange={(value) =>
                                update(
                                    "requireApproval",
                                    value
                                )
                            }
                        />
                    </section>

                    <SaveButton
                        saving={saving}
                        onClick={handleSave}
                    />
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
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                    <CircleDollarSign
                        size={21}
                        className="text-green-600"
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

function Input({
    label,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}) {
    return (
        <label>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </span>

            <input
                type={type}
                min="0"
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </label>
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
            <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    {description}
                </p>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`
                    relative
                    h-6
                    w-11
                    shrink-0
                    rounded-full
                    transition
                    ${checked
                        ? "bg-blue-600"
                        : "bg-slate-200"
                    }
                `}
            >
                <span
                    className={`
                        absolute
                        top-0.5
                        h-5
                        w-5
                        rounded-full
                        bg-white
                        shadow-sm
                        transition
                        ${checked
                            ? "left-[22px]"
                            : "left-0.5"
                        }
                    `}
                />
            </button>
        </div>
    );
}

function SaveButton({
    saving,
    onClick,
}: {
    saving: boolean;
    onClick: () => void;
}) {
    return (
        <div className="flex justify-end">
            <button
                type="button"
                onClick={onClick}
                disabled={saving}
                className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
                <Save size={17} />
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}