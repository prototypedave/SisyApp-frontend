"use client";

import Link from "next/link";
import {
    ChevronRight,
    LucideIcon,
} from "lucide-react";

interface SettingsItemProps {
    href: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string;
}

export default function SettingsItem({
    href,
    icon: Icon,
    iconBg,
    iconColor,
    title,
    description,
}: SettingsItemProps) {
    return (
        <Link
            href={href}
            className="
                group
                flex
                min-h-[76px]
                items-center
                gap-3
                border-b
                border-slate-100
                p-4
                transition
                last:border-b-0
                hover:bg-slate-50
                active:bg-slate-100
                sm:gap-4
                sm:p-5
            "
        >
            <div
                className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${iconBg}
                    sm:h-11
                    sm:w-11
                `}
            >
                <Icon
                    size={20}
                    className={iconColor}
                    strokeWidth={2}
                />
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-900">
                    {title}
                </h3>

                <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                    {description}
                </p>
            </div>

            <ChevronRight
                size={18}
                className="
                    shrink-0
                    text-slate-400
                    transition-transform
                    group-hover:translate-x-0.5
                    group-hover:text-slate-600
                "
            />
        </Link>
    );
}