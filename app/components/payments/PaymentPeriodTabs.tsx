"use client";

interface PaymentPeriodTabsProps {
    activePeriod: string;
    onChange: (value: string) => void;
}

const tabs = [
    {
        value: "all",
        label: "All Payments",
    },
    {
        value: "today",
        label: "Today",
    },
    {
        value: "this-week",
        label: "This Week",
    },
    {
        value: "this-month",
        label: "This Month",
    },
];

export default function PaymentPeriodTabs({
    activePeriod,
    onChange,
}: PaymentPeriodTabsProps) {
    return (
        <div className="overflow-x-auto border-b border-slate-100">
            <div className="flex min-w-max px-4 sm:px-5 lg:px-6">
                {tabs.map((tab) => {
                    const active =
                        activePeriod === tab.value;

                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() =>
                                onChange(tab.value)
                            }
                            className={`
                                relative
                                px-4 py-4
                                text-sm font-medium
                                transition
                                first:pl-0
                                ${
                                    active
                                        ? "text-blue-600"
                                        : "text-slate-500 hover:text-slate-800"
                                }
                            `}
                        >
                            {tab.label}

                            {active && (
                                <span
                                    className="
                                        absolute inset-x-0
                                        bottom-0
                                        h-0.5
                                        rounded-full
                                        bg-blue-600
                                    "
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}