"use client";

import {
    ArrowDownRight,
    ArrowUpRight,
    LucideIcon,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    iconName: string;
    iconBg: string;
    iconColor: string;
    change: string;
    direction: "up" | "down";
    sentiment: "positive" | "negative" | "neutral";
}

export default function StatsCard({
    title,
    value,
    iconName,
    iconBg,
    iconColor,
    change,
    direction,
    sentiment,
}: StatsCardProps) {
    const Icon = LucideIcons[
        iconName as keyof typeof LucideIcons
    ] as LucideIcon;

    const sentimentClasses = {
        positive: "text-green-600",
        negative: "text-red-600",
        neutral: "text-slate-500",
    };

    const changeColor = sentimentClasses[sentiment];

    return (
        <div
            className="
                group
                rounded-2xl
                border border-slate-200
                bg-white
                p-4
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                sm:p-5
                lg:p-6
            "
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                        {title}
                    </p>

                    <h2
                        className="
                            mt-2
                            truncate
                            text-xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:mt-3
                            sm:text-2xl
                            lg:text-3xl
                        "
                    >
                        {value}
                    </h2>
                </div>

                <div
                    className={`
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-xl
                        ${iconBg}
                        transition-transform
                        duration-200
                        group-hover:scale-105
                        sm:h-12 sm:w-12
                        sm:rounded-2xl
                        lg:h-14 lg:w-14
                    `}
                >
                    <Icon
                        size={20}
                        strokeWidth={2}
                        className={iconColor}
                    />
                </div>
            </div>

            <div
                className={`
                    mt-3
                    flex flex-wrap
                    items-center
                    gap-x-1
                    gap-y-0.5
                    text-xs
                    font-medium
                    sm:mt-4
                    sm:text-sm
                    ${changeColor}
                `}
            >
                <span className="flex items-center">
                    {direction === "up" ? (
                        <ArrowUpRight
                            size={15}
                            strokeWidth={2.2}
                        />
                    ) : (
                        <ArrowDownRight
                            size={15}
                            strokeWidth={2.2}
                        />
                    )}

                    <span>{change}</span>
                </span>

                <span className="font-normal text-slate-400">
                    from last month
                </span>
            </div>
        </div>
    );
}