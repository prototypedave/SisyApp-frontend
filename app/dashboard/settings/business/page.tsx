"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Building2,
    Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function BusinessSettings() {
    const router = useRouter();

    const [form, setForm] = useState({
        businessName: "SisyLoan",
        phone: "",
        email: "",
        address: "",
        currency: "KES",
        timezone: "Africa/Nairobi",
    });

    const [saving, setSaving] = useState(false);

    const updateField = (
        field: keyof typeof form,
        value: string
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            // Replace with your API call.
            //
            // await fetch(
            //     `${process.env.NEXT_PUBLIC_API_URL}/settings/business`,
            //     {
            //         method: "PATCH",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify(form),
            //     }
            // );
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-full">
            <div className="mx-auto w-full max-w-[900px]">

                <PageHeader
                    router={router}
                    icon={Building2}
                    title="Business Information"
                    description="Manage your SisyLoan business details."
                />

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-4 sm:p-5">
                        <h2 className="text-base font-semibold text-slate-900">
                            Business Details
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            These details can be used on reports,
                            receipts and future documents.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 md:grid-cols-2">

                        <Input
                            label="Business Name"
                            value={form.businessName}
                            onChange={(value) =>
                                updateField(
                                    "businessName",
                                    value
                                )
                            }
                        />

                        <Input
                            label="Phone Number"
                            value={form.phone}
                            onChange={(value) =>
                                updateField(
                                    "phone",
                                    value
                                )
                            }
                            placeholder="+254..."
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            value={form.email}
                            onChange={(value) =>
                                updateField(
                                    "email",
                                    value
                                )
                            }
                        />

                        <Input
                            label="Address"
                            value={form.address}
                            onChange={(value) =>
                                updateField(
                                    "address",
                                    value
                                )
                            }
                        />

                        <Select
                            label="Currency"
                            value={form.currency}
                            onChange={(value) =>
                                updateField(
                                    "currency",
                                    value
                                )
                            }
                            options={[
                                {
                                    value: "KES",
                                    label: "KES - Kenyan Shilling",
                                },
                                {
                                    value: "USD",
                                    label: "USD - US Dollar",
                                },
                                {
                                    value: "UGX",
                                    label: "UGX - Ugandan Shilling",
                                },
                                {
                                    value: "TZS",
                                    label: "TZS - Tanzanian Shilling",
                                },
                            ]}
                        />

                        <Select
                            label="Timezone"
                            value={form.timezone}
                            onChange={(value) =>
                                updateField(
                                    "timezone",
                                    value
                                )
                            }
                            options={[
                                {
                                    value: "Africa/Nairobi",
                                    label: "Africa/Nairobi",
                                },
                                {
                                    value: "Africa/Kampala",
                                    label: "Africa/Kampala",
                                },
                                {
                                    value: "Africa/Dar_es_Salaam",
                                    label: "Africa/Dar es Salaam",
                                },
                            ]}
                        />
                    </div>

                    <FormFooter
                        saving={saving}
                        onSave={handleSave}
                    />
                </section>
            </div>
        </main>
    );
}

function PageHeader({
    router,
    icon: Icon,
    title,
    description,
}: {
    router: ReturnType<typeof useRouter>;
    icon: typeof Building2;
    title: string;
    description: string;
}) {
    return (
        <div className="mb-6">
            <button
                type="button"
                onClick={() => router.push("/dashboard/settings")}
                className="
                    mb-4
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-500
                    hover:text-slate-900
                "
            >
                <ArrowLeft size={17} />
                Settings
            </button>

            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Icon
                        size={21}
                        className="text-blue-600"
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
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </span>

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            />
        </label>
    );
}

function Select({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: {
        value: string;
        label: string;
    }[];
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </span>

            <select
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
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
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function FormFooter({
    saving,
    onSave,
}: {
    saving: boolean;
    onSave: () => void;
}) {
    return (
        <div className="flex justify-end border-t border-slate-200 p-4 sm:p-5">
            <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="
                    flex h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >
                <Save size={17} />
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}