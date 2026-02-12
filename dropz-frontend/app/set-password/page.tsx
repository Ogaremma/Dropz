"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useWallet } from "../hooks/useWallet";

export default function SetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setPassword, authenticated, ready } = useAuth();
    const { address } = useWallet();
    const [password, setPasswordInput] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (ready && !authenticated) {
            router.push("/");
        }
    }, [ready, authenticated, router]);

    const getPasswordStrength = (pwd: string) => {
        if (pwd.length < 6) return { strength: "weak", color: "red", text: "Too short" };
        if (pwd.length < 10) return { strength: "medium", color: "yellow", text: "Medium" };
        if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { strength: "medium", color: "yellow", text: "Medium" };
        return { strength: "strong", color: "green", text: "Strong" };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!address) {
            setError("No wallet address found");
            return;
        }

        setLoading(true);
        try {
            await setPassword(address, password);
            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to set password");
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        router.push("/dashboard");
    };

    const passwordStrength = getPasswordStrength(password);

    if (!ready || !authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] delay-1000 animate-pulse"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-[#0a0a0b] border border-white/10 rounded-[3.5rem] p-12 shadow-[0_0_100px_rgba(79,70,229,0.15)]">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-[3.5rem]"></div>

                    {success ? (
                        <div className="text-center py-10 animate-in zoom-in-95 duration-700">
                            <div className="text-8xl mb-8 bg-green-500/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-2xl shadow-green-500/20">✓</div>
                            <h2 className="text-3xl font-black text-white mb-3">Password Set!</h2>
                            <p className="text-gray-500 font-bold">Redirecting to dashboard...</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-10">
                                <div className="text-6xl mb-6">🔐</div>
                                <h1 className="text-4xl font-black mb-3 tracking-tighter">Create Password</h1>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Set a password for easier login. You won't need your seed phrase every time!
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white font-bold placeholder:text-gray-700 text-lg"
                                        placeholder="Enter password"
                                        required
                                    />
                                    {password && (
                                        <div className="flex items-center gap-2 ml-1">
                                            <div className={`h-1 w-full rounded-full bg-${passwordStrength.color}-500/20`}>
                                                <div
                                                    className={`h-full rounded-full bg-${passwordStrength.color}-500 transition-all`}
                                                    style={{
                                                        width: passwordStrength.strength === "weak" ? "33%" : passwordStrength.strength === "medium" ? "66%" : "100%"
                                                    }}
                                                ></div>
                                            </div>
                                            <span className={`text-xs font-bold text-${passwordStrength.color}-500`}>
                                                {passwordStrength.text}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white font-bold placeholder:text-gray-700 text-lg"
                                        placeholder="Confirm password"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-white text-black py-6 rounded-2xl hover:scale-[1.02] transition-all font-black text-xl disabled:opacity-50 shadow-2xl active:scale-95"
                                    >
                                        {loading ? "Setting Password..." : "Set Password"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSkip}
                                        className="w-full py-5 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all font-black uppercase tracking-widest text-xs"
                                    >
                                        Skip for Now
                                    </button>
                                </div>
                            </form>

                            <p className="mt-6 text-center text-xs text-gray-600">
                                You can always set a password later from your profile settings
                            </p>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
