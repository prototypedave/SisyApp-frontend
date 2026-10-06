"use client";

import {
    AlertTriangle,
    ArrowRight,
    BadgeCheck,
    Clock3,
    CreditCard,
    UserPlus,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export interface Activity {
    id: number;
    title: string;
    description: string;
    time: string;
    type: "payment" | "loan" | "client" | "warning";

    // Used to make an activity clickable
    entity_type?: "loan" | "client" | "payment";
    entity_id?: string | number;
}

async function fetchLogs(): Promise<Activity[]> {
    const response = await fetch(
        "http://127.0.0.1:5000/logs"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch activity logs");
    }

    return response.json();
}

export default function ActivityCard() {
    const router = useRouter();

    const {
        data: activities = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["activities"],
        queryFn: fetchLogs,
        refetchInterval: 60 * 1000,
    });

    const activityStyles = {
        payment: {
            icon: CreditCard,
            bg: "bg-green-100",
            color: "text-green-600",
        },
        loan: {
            icon: BadgeCheck,
            bg: "bg-blue-100",
            color: "text-blue-600",
        },
        client: {
            icon: UserPlus,
            bg: "bg-purple-100",
            color: "text-purple-600",
        },
        warning: {
            icon: AlertTriangle,
            bg: "bg-red-100",
            color: "text-red-600",
        },
    };

    const displayedActivities = activities.slice(0, 7);

    const handleActivityClick = (activity: Activity) => {
        if (
            activity.entity_id === undefined ||
            !activity.entity_type
        ) {
            return;
        }

        switch (activity.entity_type) {
            case "loan":
                router.push(
                    `/dashboard/loans/${activity.entity_id}`
                );
                break;

            case "client":
                router.push(
                    `/dashboard/customers/${activity.entity_id}`
                );
                break;

            case "payment":
                router.push(
                    `/dashboard/payments/${activity.entity_id}`
                );
                break;
        }
    };

    const isClickable = (activity: Activity) => {
        return (
            activity.entity_id !== undefined &&
            !!activity.entity_type
        );
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
                <div className="min-w-0">
                    <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                        Recent Activity
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                        Latest actions in your account
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        router.push("/dashboard/activity")
                    }
                    className="
                        flex shrink-0 items-center gap-1
                        text-xs font-semibold text-blue-600
                        transition hover:text-blue-700
                        sm:text-sm
                    "
                >
                    View all
                    <ArrowRight size={15} />
                </button>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="divide-y divide-slate-100 p-4 sm:p-5 lg:p-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex gap-4 py-4 first:pt-0 last:pb-0"
                        >
                            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-100" />

                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="h-3.5 w-32 animate-pulse rounded bg-slate-100" />
                                <div className="h-3 w-52 max-w-full animate-pulse rounded bg-slate-100" />
                                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {!isLoading && error && (
                <div className="px-5 py-10 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                        <AlertTriangle
                            size={20}
                            className="text-red-500"
                        />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-800">
                        Unable to load recent activity
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Please try again shortly.
                    </p>
                </div>
            )}

            {/* Empty */}
            {!isLoading &&
                !error &&
                displayedActivities.length === 0 && (
                    <div className="px-5 py-10 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                            <Clock3
                                size={20}
                                className="text-slate-500"
                            />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-800">
                            No recent activity
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            New customers, loans and payments will
                            appear here.
                        </p>
                    </div>
                )}

            {/* Activities */}
            {!isLoading &&
                !error &&
                displayedActivities.length > 0 && (
                    <div className="px-4 py-2 sm:px-5 lg:px-6">
                        {displayedActivities.map(
                            (activity, index) => {
                                const style =
                                    activityStyles[activity.type];

                                const Icon = style.icon;

                                const clickable =
                                    isClickable(activity);

                                return (
                                    <div
                                        key={activity.id}
                                        className="relative flex gap-3 py-4 sm:gap-4 sm:py-5"
                                    >
                                        {/* Timeline line */}
                                        {index !==
                                            displayedActivities.length -
                                                1 && (
                                            <div className="absolute left-5 top-14 bottom-0 w-px bg-slate-200" />
                                        )}

                                        {/* Icon */}
                                        <div
                                            className={`
                                                relative z-10
                                                flex h-10 w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                ${style.bg}
                                            `}
                                        >
                                            <Icon
                                                size={18}
                                                className={style.color}
                                                strokeWidth={2}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            {clickable ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleActivityClick(
                                                            activity
                                                        )
                                                    }
                                                    className="
                                                        group
                                                        w-full
                                                        text-left
                                                        rounded-lg
                                                        transition
                                                        hover:bg-slate-50
                                                    "
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <h3 className="truncate text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                                                                {
                                                                    activity.title
                                                                }
                                                            </h3>

                                                            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                                                                {
                                                                    activity.description
                                                                }
                                                            </p>

                                                            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 sm:text-xs">
                                                                <Clock3
                                                                    size={
                                                                        13
                                                                    }
                                                                />

                                                                <span>
                                                                    {
                                                                        activity.time
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <ArrowRight
                                                            size={15}
                                                            className="
                                                                mt-1
                                                                shrink-0
                                                                text-slate-300
                                                                transition
                                                                group-hover:translate-x-0.5
                                                                group-hover:text-blue-500
                                                            "
                                                        />
                                                    </div>
                                                </button>
                                            ) : (
                                                <>
                                                    <h3 className="text-sm font-semibold text-slate-800">
                                                        {
                                                            activity.title
                                                        }
                                                    </h3>

                                                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                                                        {
                                                            activity.description
                                                        }
                                                    </p>

                                                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 sm:text-xs">
                                                        <Clock3
                                                            size={13}
                                                        />

                                                        <span>
                                                            {
                                                                activity.time
                                                            }
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}

            {/* Footer */}
            {!isLoading &&
                !error &&
                displayedActivities.length > 0 && (
                    <div className="border-t border-slate-100 px-4 py-3 sm:px-5">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/dashboard/activity"
                                )
                            }
                            className="
                                flex w-full
                                items-center
                                justify-center
                                gap-1
                                text-xs
                                font-medium
                                text-slate-500
                                transition
                                hover:text-blue-600
                            "
                        >
                            View all activity
                            <ArrowRight size={14} />
                        </button>
                    </div>
                )}
        </section>
    );
}