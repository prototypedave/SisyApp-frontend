"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface TopbarProps {
    onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/loans": "Loans",
    "/dashboard/payments": "Payments",
    "/dashboard/customers": "Customers",
    "/dashboard/reports": "Reports",
    "/dashboard/settings": "Settings",
};

export default function Topbar({ onMenuClick}: TopbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const [ loading, setLoading, ] = useState(false);
    const pageTitle =
        pageTitles[pathname] || (pathname.startsWith("/dashboard/loans") ? "Loans"
            : pathname.startsWith("/dashboard/customers") ? "Customers"
              : pathname.startsWith("/dashboard/payments") ? "Payments"
                : pathname.startsWith("/dashboard/reports") ? "Reports"
                  : pathname.startsWith("/dashboard/settings") ? "Settings"
                    : "Dashboard");

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => { setUserMenuOpen(false); }, [pathname]);
    async function handleLogout() {
        setLoading(true);
        try {
            const csrfResponse = await fetch("/api/auth/csrf");
            if (!csrfResponse.ok) {
                throw new Error("Unable to obtain security token.");
            }

            const { token } = await csrfResponse.json();
            const response = await fetch("/api/auth/logout",
                {
                    method: "POST",
                    headers: {
                            "X-CSRF-Token": token,
                        },
                    }
                );

            if (!response.ok) {
                throw new Error("Logout failed.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            router.replace("/");
            router.refresh();
        }
    }

    return (
        <header
            className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:h-20 md:px-8">
            <div className="flex min-w-0 items-center gap-3 md:gap-6">
                <button type="button" onClick={onMenuClick} aria-label="Open navigation" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 active:scale-95 lg:hidden">
                    <Menu size={23} strokeWidth={2} />
                </button>  
                <div className="min-w-0 lg:hidden">
                    <h1 className="truncate text-base font-semibold text-slate-800">{pageTitle}</h1>
                </div>
                <div className="hidden md:flex lg:ml-2">
                    <div
                        className="flex w-[360px] items-center rounded-xl bg-slate-100 px-4 py-2.5 xl:w-[420px]">
                        <Search size={18} className="mr-3 shrink-0 text-slate-400"/>
                        <input type="text" placeholder="Search loans, customers..." className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"/>
                        <span className=" hidden rounded-md border border-slate-300 px-2 py-1 text-[10px] text-slate-400 lg:block">Ctrl + K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1.5 md:gap-4">
                <button
                    type="button" aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 active:scale-95 md:hidden">
                    <Search size={21} strokeWidth={2} />
                </button>

                <button type="button" aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 active:scale-95">
                    <Bell size={21} strokeWidth={2} />
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">3</span>
                </button>
                <div ref={userMenuRef} className="relative">
                    <button type="button" onClick={() => setUserMenuOpen((open) => !open)} aria-label="Open user menu" aria-expanded={userMenuOpen} className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 active:scale-[0.98] md:gap-3 md:px-2.5 md:py-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 md:h-10 md:w-10">AD</div>
                        <div className="hidden text-left md:block">
                            <p className="text-sm font-semibold text-slate-800">Admin</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                        <ChevronDown size={17} className={`hidden text-slate-500 transition-transform md:block ${userMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    {userMenuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10">
                            <div className="border-b border-slate-100 px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700 ring-1 ring-slate-200">AD</div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-800">Admin</p>
                                        <p className="truncate text-xs text-slate-500">Administrator</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserMenuOpen(false);
                                        router.push("/dashboard/profile");}}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                        <User size={18} className="text-slate-600"/>
                                    </span>
                                    <span>Profile</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserMenuOpen(false);
                                        router.push("/dashboard/settings");}}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                        <Settings size={18} className="text-slate-600" />
                                    </span>
                                    <span>Settings</span>
                                </button>
                                <div className="my-2 border-t border-slate-100" />
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50">
                                    <span
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                                        <LogOut size={18} className="text-red-600" />
                                    </span>
                                    <span>Log out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

