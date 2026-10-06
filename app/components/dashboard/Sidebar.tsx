"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Landmark,
    LayoutDashboard,
    FileText,
    Wallet,
    Users,
    BarChart3,
    Settings,
    CircleHelp,
    X,
    ChevronRight,
} from "lucide-react";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const menuItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
    },
    {
        title: "Loans",
        href: "/dashboard/loans",
        icon: FileText,
    },
    {
        title: "Imvestors",
        href: "/dashboard/investors",
        icon: Wallet,
    },
    
    {
        title: "Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export default function Sidebar({
    open,
    onClose,
}: SidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }

        return pathname.startsWith(href);
    };

    return (
        <>
            <div onClick={onClose} className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}/>
            <aside className={`fixed left-0 top-0 z-50 flex h-dvh w-[280px] flex-col bg-[#0F1D48] text-white shadow-2xl shadow-slate-950/20 transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none ${open? "translate-x-0": "-translate-x-full"}`}>
                <div className="flex items-center justify-between px-5 pb-6 pt-6">
                    <Link
                        href="/dashboard"
                        onClick={onClose}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                            <Landmark
                                size={23}
                                strokeWidth={2}
                            />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight">
                                SisyLoan
                            </h1>

                            <p className="text-[11px] text-blue-200/80">
                                Loan Management
                            </p>
                        </div>
                    </Link>

                    {/* Mobile close button */}
                    <button
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="
                            flex h-10 w-10 items-center justify-center
                            rounded-xl
                            text-slate-300
                            transition
                            hover:bg-white/10
                            hover:text-white
                            active:scale-95
                            lg:hidden
                        "
                    >
                        <X size={21} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3">
                    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Menu
                    </p>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`
                                        group flex min-h-12 items-center gap-3
                                        rounded-xl px-3
                                        transition-all
                                        active:scale-[0.98]
                                        ${
                                            active
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                                        }
                                    `}
                                >
                                    <span
                                        className={`
                                            flex h-10 w-10 shrink-0
                                            items-center justify-center
                                            rounded-lg
                                            transition
                                            ${
                                                active
                                                    ? "bg-white/10"
                                                    : "bg-transparent group-hover:bg-white/5"
                                            }
                                        `}
                                    >
                                        <Icon
                                            size={20}
                                            strokeWidth={active ? 2.2 : 1.9}
                                        />
                                    </span>

                                    <span className="flex-1 text-sm font-medium">
                                        {item.title}
                                    </span>

                                    {active && (
                                        <ChevronRight
                                            size={16}
                                            className="text-blue-100"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom section */}
                <div className="border-t border-white/10 p-3">
                    <div className="rounded-2xl bg-white/[0.06] p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                <CircleHelp
                                    size={18}
                                    className="text-blue-200"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white">
                                    Need help?
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                    Contact support if you need assistance.
                                </p>
                            </div>
                        </div>

                        <button
                            className="
                                mt-3 flex w-full items-center justify-center
                                rounded-xl bg-white/10
                                py-2.5
                                text-sm font-medium text-white
                                transition
                                hover:bg-white/15
                                active:scale-[0.98]
                            "
                        >
                            Contact Support
                        </button>
                    </div>

                    {/* Version */}
                    <p className="pt-3 text-center text-[10px] text-slate-500">
                        SisyLoan v1.0
                    </p>
                </div>
            </aside>
        </>
    );
}