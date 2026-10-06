"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Save,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileSettings() {
    const router = useRouter();

    const [name, setName] = useState("Admin");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);

        try {
            // PATCH /settings/profile
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-full">
            <div className="mx-auto w-full max-w-[700px]">

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
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50">
                            <User
                                size={21}
                                className="text-cyan-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                My Profile
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage your administrator profile.
                            </p>
                        </div>
                    </div>
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid gap-5 p-4 sm:p-5">

                        <Input
                            label="Name"
                            value={name}
                            onChange={setName}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={setEmail}
                        />

                        <Input
                            label="Phone Number"
                            value={phone}
                            onChange={setPhone}
                        />
                    </div>

                    <div className="flex justify-end border-t border-slate-200 p-4 sm:p-5">
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
                </section>
            </div>
        </main>
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
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </label>
    );
}