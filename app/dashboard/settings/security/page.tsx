"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Lock,
    Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SecuritySettings() {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChangePassword = async () => {
        setError("");

        if (!currentPassword) {
            setError("Enter your current password.");
            return;
        }

        if (newPassword.length < 8) {
            setError(
                "New password must contain at least 8 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "New passwords do not match."
            );
            return;
        }

        setSaving(true);

        try {
            // POST /auth/change-password
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
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                            <Lock
                                size={21}
                                className="text-red-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                Security
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage your account security.
                            </p>
                        </div>
                    </div>
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-4 sm:p-5">
                        <h2 className="text-base font-semibold text-slate-900">
                            Change Password
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Use a strong password that you do not reuse elsewhere.
                        </p>
                    </div>

                    <div className="space-y-5 p-4 sm:p-5">
                        <PasswordInput
                            label="Current Password"
                            value={currentPassword}
                            onChange={
                                setCurrentPassword
                            }
                        />

                        <PasswordInput
                            label="New Password"
                            value={newPassword}
                            onChange={setNewPassword}
                        />

                        <PasswordInput
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChange={
                                setConfirmPassword
                            }
                        />

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end border-t border-slate-200 p-4 sm:p-5">
                        <button
                            type="button"
                            onClick={
                                handleChangePassword
                            }
                            disabled={saving}
                            className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            <Save size={17} />
                            {saving
                                ? "Updating..."
                                : "Change Password"}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

function PasswordInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </span>

            <input
                type="password"
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </label>
    );
}