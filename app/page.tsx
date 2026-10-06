"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, Landmark, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
    const router = useRouter();
    const [ showPassword, setShowPassword ] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await fetch("/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Invalid email or password.");
                return;
            }
            router.replace("/dashboard");
            router.refresh();
        } catch {
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 flex">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-16 flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <Landmark size={40} />
                        <h1 className="text-3xl font-bold">SisyLoan</h1>
                    </div>
                    <h2 className="mt-20 text-5xl font-bold leading-tight">Loan Management<br />Made Easy</h2>
                    <p className="mt-6 text-blue-100 text-lg max-w-md">Manage loan records and track repayments from one secure platform.</p>
                </div>
                <p className="text-sm text-blue-200">Secure loan management</p>
            </div>

            <div className="flex flex-1 justify-center items-center px-6 py-10">
                <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <Landmark size={32} className="text-blue-700" />
                        <h1 className="text-2xl font-bold text-slate-800">SisyLoan</h1>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Sign in to continue to your account.</p>

                    {error && (
                        <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="email" className="block mb-2 font-medium text-slate-700">Email</label>
                            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@gmail.com" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-800"/>
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 font-medium text-slate-700">Password</label>
                            <div className="relative">
                                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-800"/>
                                <button
                                    type="button" aria-label={ showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword((value) => !value)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-700 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 transition text-white py-3 font-semibold flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin"/>
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                    <p className="mt-8 text-center text-sm text-slate-500">Authorized access only.</p>
                </div>
            </div>
        </main>
    );
};