"use client";

interface LoanStatusTabsProps {
    activeTab: string;
    onChange: (value: string) => void;
}

const tabs = [
    {
        value: "all",
        label: "All Loans",
    },
    {
        value: "active",
        label: "Active",
    },
    {
        value: "due-soon",
        label: "Due Soon",
    },
    {
        value: "overdue",
        label: "Overdue",
    },
    {
        value: "completed",
        label: "Completed",
    },
];

export default function LoanStatusTabs({
    activeTab,
    onChange,
}: LoanStatusTabsProps) {
    return (
        <div className="overflow-x-auto border-b border-slate-100">
            <div className="flex min-w-max px-4 sm:px-5 lg:px-6">
                {tabs.map((tab) => {
                    const active = activeTab === tab.value;

                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => onChange(tab.value)}
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
                                        bottom-0 h-0.5
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