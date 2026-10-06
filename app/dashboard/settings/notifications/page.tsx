"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Bell,
    Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationSettings() {
    const router = useRouter();

    const [dueReminder, setDueReminder] =
        useState(true);

    const [overdueReminder, setOverdueReminder] =
        useState(true);

    const [paymentConfirmation, setPaymentConfirmation] =
        useState(true);

    const [newLoanNotification, setNewLoanNotification] =
        useState(true);

    const [reminderDays, setReminderDays] =
        useState("3");

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);

        try {
            // PATCH /settings/notifications
        } finally {
            setSaving(false);
        }
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
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                            <Bell
                                size={21}
                                className="text-orange-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                Notifications
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Configure loan and payment notifications.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <ToggleRow
                            title="Loan Due Reminder"
                            description="Receive a reminder when a loan is approaching its due date."
                            checked={dueReminder}
                            onChange={setDueReminder}
                        />

                        <ToggleRow
                            title="Overdue Loan Reminder"
                            description="Receive notifications when loans become overdue."
                            checked={overdueReminder}
                            onChange={
                                setOverdueReminder
                            }
                        />

                        <ToggleRow
                            title="Payment Confirmation"
                            description="Receive confirmation after recording a payment."
                            checked={
                                paymentConfirmation
                            }
                            onChange={
                                setPaymentConfirmation
                            }
                        />

                        <ToggleRow
                            title="New Loan Notification"
                            description="Receive a notification when a new loan is created."
                            checked={
                                newLoanNotification
                            }
                            onChange={
                                setNewLoanNotification
                            }
                        />
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <h2 className="text-base font-semibold text-slate-900">
                            Reminder Timing
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Choose how many days before the due date to send a reminder.
                        </p>

                        <div className="mt-4 max-w-xs">
                            <label className="block text-sm font-medium text-slate-700">
                                Days before due date
                            </label>

                            <input
                                type="number"
                                min="0"
                                max="30"
                                value={reminderDays}
                                onChange={(e) =>
                                    setReminderDays(
                                        e.target.value
                                    )
                                }
                                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
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
                className={`relative h-6 w-11 shrink-0 rounded-full ${
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