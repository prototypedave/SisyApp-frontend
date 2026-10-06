
"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Building2,
    CircleDollarSign,
    LockKeyhole,
    Settings2,
    ShieldCheck,
} from "lucide-react";

import {
    adjustFunds,
    changePassword,
    fetchFundHistory,
    fetchSettings,
    updateBusiness,
    updateOperations,
} from "@/lib/api/settings";


function formatKES(value: string) {
    return new Intl.NumberFormat(
        "en-KE",
        {
            style: "currency",
            currency: "KES",
            maximumFractionDigits: 2,
        }
    ).format(Number(value));
}


export default function SettingsClient() {
    const queryClient =
        useQueryClient();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: fetchSettings,
    });

    const {
        data: fundHistory,
    } = useQuery({
        queryKey: [
            "settings",
            "fund-history",
        ],
        queryFn: fetchFundHistory,
    });

    const [businessName, setBusinessName] =
        useState("");

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [fundType, setFundType] =
        useState<"ADD" | "REMOVE">("ADD");

    const [fundAmount, setFundAmount] =
        useState("");

    const [fundReason, setFundReason] =
        useState("");

    const [interestRate, setInterestRate] =
        useState("");

    const [minimumLoan, setMinimumLoan] =
        useState("");

    const [maximumLoan, setMaximumLoan] =
        useState("");

    const [graceDays, setGraceDays] =
        useState("0");

    const [partialPayments, setPartialPayments] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    useEffect(() => {
        if (!data) return;

        setBusinessName(
            data.company.name
        );

        setInterestRate(
            data.settings.default_interest_rate
        );

        setMinimumLoan(
            data.settings.minimum_loan_amount
        );

        setMaximumLoan(
            data.settings.maximum_loan_amount ?? ""
        );

        setGraceDays(
            String(
                data.settings.loan_grace_days
            )
        );

        setPartialPayments(
            data.settings.allow_partial_payments
        );
    }, [data]);


    const businessMutation =
        useMutation({
            mutationFn: () =>
                updateBusiness(
                    businessName
                ),

            onSuccess: () => {
                setMessage(
                    "Business details updated."
                );

                setErrorMessage("");

                queryClient.invalidateQueries({
                    queryKey: ["settings"],
                });
            },

            onError: (error) => {
                setErrorMessage(
                    error.message
                );

                setMessage("");
            },
        });


    const passwordMutation =
        useMutation({
            mutationFn: () =>
                changePassword({
                    current_password:
                        currentPassword,

                    new_password:
                        newPassword,

                    confirm_password:
                        confirmPassword,
                }),

            onSuccess: () => {
                setMessage(
                    "Password changed. Please sign in again."
                );

                setErrorMessage("");

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            },

            onError: (error) => {
                setErrorMessage(
                    error.message
                );

                setMessage("");
            },
        });


    const fundsMutation =
        useMutation({
            mutationFn: () =>
                adjustFunds({
                    adjustment_type:
                        fundType,

                    amount:
                        fundAmount,

                    reason:
                        fundReason,
                }),

            onSuccess: () => {
                setMessage(
                    "Company funds updated."
                );

                setErrorMessage("");

                setFundAmount("");
                setFundReason("");

                queryClient.invalidateQueries({
                    queryKey: ["settings"],
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "settings",
                        "fund-history",
                    ],
                });
            },

            onError: (error) => {
                setErrorMessage(
                    error.message
                );

                setMessage("");
            },
        });


    const operationsMutation =
        useMutation({
            mutationFn: () =>
                updateOperations({
                    default_interest_rate:
                        interestRate,

                    minimum_loan_amount:
                        minimumLoan,

                    maximum_loan_amount:
                        maximumLoan || null,

                    loan_grace_days:
                        Number(graceDays),

                    allow_partial_payments:
                        partialPayments,
                }),

            onSuccess: () => {
                setMessage(
                    "Loan settings updated."
                );

                setErrorMessage("");

                queryClient.invalidateQueries({
                    queryKey: ["settings"],
                });
            },

            onError: (error) => {
                setErrorMessage(
                    error.message
                );

                setMessage("");
            },
        });


    if (isLoading) {
        return (
            <main className="min-h-full">
                <div className="mx-auto w-full max-w-[900px] p-4 sm:p-5">
                    <div className="animate-pulse">
                        <div className="mb-2 h-7 w-32 rounded bg-slate-200" />

                        <div className="h-4 w-72 rounded bg-slate-100" />
                    </div>
                </div>
            </main>
        );
    }


    if (isError || !data) {
        return (
            <main className="min-h-full">
                <div className="mx-auto w-full max-w-[900px] p-4 sm:p-5">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error?.message ||
                            "Unable to load settings."}
                    </div>
                </div>
            </main>
        );
    }


    return (
        <main className="min-h-full">
            <div className="mx-auto w-full max-w-[900px]">

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                            <Settings2
                                size={21}
                                className="text-blue-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                Settings
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage your business, security,
                                company funds and loan settings.
                            </p>
                        </div>
                    </div>
                </div>


                {/* Status message */}
                {(message || errorMessage) && (
                    <div
                        className={`mb-6 rounded-xl border p-4 text-sm ${
                            errorMessage
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {errorMessage || message}
                    </div>
                )}


                {/* Business */}
                <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <Building2
                                    size={19}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Business
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Basic business information.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 p-4 sm:p-5">

                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                Business Name
                            </span>

                            <input
                                value={businessName}
                                onChange={(event) =>
                                    setBusinessName(
                                        event.target.value
                                    )
                                }
                                maxLength={120}
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

                        <div className="flex justify-end border-t border-slate-200 pt-5">
                            <button
                                type="button"
                                onClick={() =>
                                    businessMutation.mutate()
                                }
                                disabled={
                                    businessMutation.isPending
                                }
                                className="
                                    flex
                                    h-11
                                    items-center
                                    justify-center
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
                                {businessMutation.isPending
                                    ? "Saving..."
                                    : "Save Business"}
                            </button>
                        </div>
                    </div>
                </section>


                {/* Company Funds */}
                <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <CircleDollarSign
                                    size={19}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Company Funds
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage the money available
                                    for lending.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5">

                        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">
                                Available Funds
                            </p>

                            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                {formatKES(
                                    data.company.current_amount
                                )}
                            </p>
                        </div>


                        <div className="grid gap-5 md:grid-cols-2">

                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Action
                                </span>

                                <select
                                    value={fundType}
                                    onChange={(event) =>
                                        setFundType(
                                            event.target.value as
                                                | "ADD"
                                                | "REMOVE"
                                        )
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
                                    <option value="ADD">
                                        Add Funds
                                    </option>

                                    <option value="REMOVE">
                                        Remove Funds
                                    </option>
                                </select>
                            </label>


                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                    Amount
                                </span>

                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={fundAmount}
                                    onChange={(event) =>
                                        setFundAmount(
                                            event.target.value
                                        )
                                    }
                                    placeholder="0.00"
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

                        </div>


                        <label className="mt-5 block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                Reason
                            </span>

                            <textarea
                                value={fundReason}
                                onChange={(event) =>
                                    setFundReason(
                                        event.target.value
                                    )
                                }
                                rows={3}
                                maxLength={500}
                                placeholder="Why are these funds being added or removed?"
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2.5
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


                        <div className="mt-5 flex justify-end border-t border-slate-200 pt-5">
                            <button
                                type="button"
                                onClick={() =>
                                    fundsMutation.mutate()
                                }
                                disabled={
                                    fundsMutation.isPending ||
                                    !fundAmount ||
                                    !fundReason
                                }
                                className="
                                    flex
                                    h-11
                                    items-center
                                    justify-center
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
                                {fundsMutation.isPending
                                    ? "Updating..."
                                    : fundType === "ADD"
                                    ? "Add Funds"
                                    : "Remove Funds"}
                            </button>
                        </div>

                    </div>


                    {/* Fund history */}
                    {fundHistory &&
                        fundHistory.length > 0 && (
                            <div className="border-t border-slate-200">

                                <div className="p-4 sm:p-5">
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Recent Adjustments
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Manual changes to company
                                        funds.
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">

                                        <thead className="border-y border-slate-200 bg-slate-50">
                                            <tr>
                                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Date
                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Action
                                                </th>

                                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Amount
                                                </th>

                                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Balance
                                                </th>

                                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Reason
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {fundHistory.map(
                                                (item) => (
                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                        className="border-b border-slate-100 last:border-0"
                                                    >
                                                        <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                                                            {item.created_at
                                                                ? new Date(
                                                                      item.created_at
                                                                  ).toLocaleString()
                                                                : "—"}
                                                        </td>

                                                        <td className="px-5 py-3">
                                                            <span
                                                                className={
                                                                    item.adjustment_type ===
                                                                    "ADD"
                                                                        ? "font-medium text-emerald-600"
                                                                        : "font-medium text-red-600"
                                                                }
                                                            >
                                                                {item.adjustment_type ===
                                                                "ADD"
                                                                    ? "Added"
                                                                    : "Removed"}
                                                            </span>
                                                        </td>

                                                        <td className="whitespace-nowrap px-5 py-3 text-right font-medium text-slate-900">
                                                            {formatKES(
                                                                item.amount
                                                            )}
                                                        </td>

                                                        <td className="whitespace-nowrap px-5 py-3 text-right font-medium text-slate-900">
                                                            {formatKES(
                                                                item.balance_after
                                                            )}
                                                        </td>

                                                        <td className="min-w-[220px] px-5 py-3 text-slate-600">
                                                            {
                                                                item.reason
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        )}
                </section>


                {/* Security */}
                <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-4 sm:p-5">
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <ShieldCheck
                                    size={19}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Security
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Change the owner account
                                    password.
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="space-y-5 p-4 sm:p-5">

                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                Current Password
                            </span>

                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(event) =>
                                    setCurrentPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="current-password"
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


                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                New Password
                            </span>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="new-password"
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

                            <p className="mt-1.5 text-xs text-slate-500">
                                Use at least 12 characters.
                            </p>
                        </label>


                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                Confirm New Password
                            </span>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="new-password"
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


                        <div className="flex justify-end border-t border-slate-200 pt-5">
                            <button
                                type="button"
                                onClick={() =>
                                    passwordMutation.mutate()
                                }
                                disabled={
                                    passwordMutation.isPending ||
                                    !currentPassword ||
                                    !newPassword ||
                                    !confirmPassword
                                }
                                className="
                                    flex
                                    h-11
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
                                <LockKeyhole size={17} />

                                {passwordMutation.isPending
                                    ? "Changing..."
                                    : "Change Password"}
                            </button>
                        </div>

                    </div>
                </section>


                {/* Loan settings */}
                <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-4 sm:p-5">
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                <Settings2
                                    size={19}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Loan Settings
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Defaults used when creating
                                    loans.
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-2">

                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                Default Interest Rate (%)
                            </span>

                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={interestRate}
                                onChange={(event) =>
                                    setInterestRate(
                                        event.target.value
                                    )
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
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </label>


                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                Minimum Loan Amount
                            </span>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={minimumLoan}
                                onChange={(event) =>
                                    setMinimumLoan(
                                        event.target.value
                                    )
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
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </label>


                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                Maximum Loan Amount
                            </span>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={maximumLoan}
                                onChange={(event) =>
                                    setMaximumLoan(
                                        event.target.value
                                    )
                                }
                                placeholder="No limit"
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


                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                Grace Period (Days)
                            </span>

                            <input
                                type="number"
                                min="0"
                                max="365"
                                value={graceDays}
                                onChange={(event) =>
                                    setGraceDays(
                                        event.target.value
                                    )
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
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </label>


                        <label className="flex items-center gap-3 md:col-span-2">
                            <input
                                type="checkbox"
                                checked={partialPayments}
                                onChange={(event) =>
                                    setPartialPayments(
                                        event.target.checked
                                    )
                                }
                                className="
                                    h-4
                                    w-4
                                    rounded
                                    border-slate-300
                                    text-blue-600
                                    focus:ring-blue-500
                                "
                            />

                            <span className="text-sm text-slate-700">
                                Allow partial loan payments
                            </span>
                        </label>


                        <div className="flex justify-end border-t border-slate-200 pt-5 md:col-span-2">
                            <button
                                type="button"
                                onClick={() =>
                                    operationsMutation.mutate()
                                }
                                disabled={
                                    operationsMutation.isPending
                                }
                                className="
                                    flex
                                    h-11
                                    items-center
                                    justify-center
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
                                {operationsMutation.isPending
                                    ? "Saving..."
                                    : "Save Loan Settings"}
                            </button>
                        </div>

                    </div>
                </section>

            </div>
        </main>
    );
}

