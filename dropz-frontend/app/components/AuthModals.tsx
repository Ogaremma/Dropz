"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "seed" | "email";
}

export default function AuthModals({ isOpen, onClose, type }: AuthModalProps) {
    const {
        registerWithEmail,
        loginWithEmail,
        generateSeedphrase,
        registerSeedphraseWallet,
        loading
    } = useAuth();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [seedData, setSeedData] = useState<{ address: string; seedPhrase?: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                await registerWithEmail(email, password);
            }
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message);
        }
    };

    const startSeedphraseFlow = async () => {
        setError(null);
        try {
            const data = await generateSeedphrase();
            setSeedData(data);
            setStep(2);
        } catch (err: any) {
            setError("Failed to generate wallet");
        }
    };

    const confirmSeedphrase = async () => {
        if (!seedData) return;
        setError(null);
        try {
            await registerSeedphraseWallet(seedData.address, seedData.seedPhrase!);
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white text-gray-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    ✕
                </button>

                {type === "email" ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                {isLogin ? "Welcome Back" : "Join Dropz"}
                            </h2>
                            <p className="text-gray-500 mt-2">
                                {isLogin ? "Login with your email and password" : "Create a new account with email"}
                            </p>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    required
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                            >
                                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
                            </button>
                        </form>

                        <div className="text-center">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm text-indigo-600 font-medium hover:underline"
                            >
                                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {step === 1 ? (
                            <div className="text-center space-y-6">
                                <div className="text-5xl">🔐</div>
                                <h2 className="text-3xl font-extrabold text-gray-900">Seed Phrase Wallet</h2>
                                <p className="text-gray-500">
                                    We will generate a 12-word recovery phrase. This phrase allows you to access your wallet from anywhere.
                                </p>
                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-sm text-left">
                                    ⚠️ **IMPORTANT**: If you lose these 12 words, you lose access to your funds forever. We cannot recover them for you.
                                </div>
                                <button
                                    onClick={startSeedphraseFlow}
                                    disabled={loading}
                                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition"
                                >
                                    {loading ? "Generating..." : "Generate Phrase Now"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-center">Your Recovery Phrase</h2>
                                <p className="text-sm text-gray-500 text-center">Write these 12 words down in order and store them safely.</p>

                                <div className="grid grid-cols-3 gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-sm shadow-inner">
                                    {seedData?.seedPhrase?.split(" ").map((word, i) => (
                                        <div key={i} className="bg-white p-2 rounded-lg border border-gray-200 flex items-center gap-2">
                                            <span className="text-gray-400 text-xs">{i + 1}</span>
                                            <span className="font-bold text-indigo-900">{word}</span>
                                        </div>
                                    ))}
                                </div>

                                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(seedData?.seedPhrase || "");
                                            alert("Seed phrase copied to clipboard!");
                                        }}
                                        className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                                    >
                                        Copy to Clipboard
                                    </button>
                                    <button
                                        onClick={confirmSeedphrase}
                                        disabled={loading}
                                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition"
                                    >
                                        {loading ? "Finalizing..." : "I have saved these words"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
