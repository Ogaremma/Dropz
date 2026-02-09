"use client";

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialFlow: "signup" | "login";
}

export default function AuthModals({ isOpen, onClose, initialFlow }: AuthModalProps) {
    const router = useRouter();
    const {
        loginWithPrivy,
        loginWithSeedphrase,
        loginWithEmail,
        registerWithEmail,
        generateSeedphrase,
        registerSeedphraseWallet,
        loading
    } = useAuth();

    const [modalType, setModalType] = useState<"choice" | "seed" | "import" | "email">("choice");
    const [step, setStep] = useState(1);
    const [seedData, setSeedData] = useState<{ address: string; seedPhrase?: string } | null>(null);
    const [importSeed, setImportSeed] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Reset state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setModalType("choice");
            setError(null);
            setStep(1);
        }
    }, [isOpen, initialFlow]);

    if (!isOpen) return null;

    const handleGmailAuth = async () => {
        try {
            await loginWithPrivy();
        } catch (err: any) {
            setError("Gmail authentication failed");
        }
    };

    const handleImportSeed = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await loginWithSeedphrase(importSeed);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Invalid seed phrase");
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (initialFlow === "login") {
                await loginWithEmail(email, password);
            } else {
                await registerWithEmail(email, password);
            }
            router.push("/dashboard");
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
            setModalType("seed");
        } catch (err: any) {
            setError("Failed to generate wallet");
        }
    };

    const confirmSeedphrase = async () => {
        if (!seedData) return;
        setError(null);
        try {
            await registerSeedphraseWallet(seedData.address, seedData.seedPhrase!);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-500">
            <div className="bg-[#0a0a0b] border border-white/10 text-white rounded-[3rem] p-10 max-w-lg w-full shadow-[0_0_100px_rgba(79,70,229,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                {modalType === "choice" && (
                    <div className="space-y-8 py-4">
                        <div className="text-center space-y-3">
                            <h2 className="text-4xl font-black tracking-tighter">
                                {initialFlow === "signup" ? "Join the " : "Enter the "}
                                <span className="text-indigo-500">Void</span>
                            </h2>
                            <p className="text-gray-400 font-medium whitespace-pre-line">
                                {initialFlow === "signup"
                                    ? "Initialize your asset management protocols."
                                    : "Select your authentication protocol to proceed."}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleGmailAuth}
                                className="w-full flex items-center gap-4 bg-white text-black p-5 rounded-2xl font-black text-lg hover:scale-[1.02] transition-all shadow-xl active:scale-95"
                            >
                                <div className="bg-red-500/10 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.144 1.144-2.924 2.456-6.248 2.456-5.344 0-9.44-4.34-10.412-9.676-.084-.464-.128-.948-.128-1.44s.044-.976.128-1.44c.972-5.336 5.068-9.676 10.412-9.676 3.1 0 5.392 1.196 7.1 2.8l2.264-2.264C18.428 1.132 15.656 0 12.24 0 5.484 0 0 5.484 0 12.24s5.484 12.24 12.24 12.24c3.684 0 6.64-1.216 8.8-3.468 2.216-2.216 2.928-5.328 2.928-7.792 0-.74-.064-1.452-.184-2.12h-11.304v-.18z" /></svg>
                                </div>
                                {initialFlow === "signup" ? "Sign Up with Gmail" : "Login with Gmail"}
                            </button>

                            {initialFlow === "signup" ? (
                                <button
                                    onClick={startSeedphraseFlow}
                                    className="w-full flex items-center gap-4 bg-indigo-600 text-white p-5 rounded-2xl font-black text-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 border border-indigo-400/30"
                                >
                                    <div className="bg-white/10 p-2 rounded-lg">🚀</div>
                                    Create Wallet
                                </button>
                            ) : (
                                <button
                                    onClick={() => setModalType("import")}
                                    className="w-full flex items-center gap-4 bg-indigo-600 text-white p-5 rounded-2xl font-black text-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 border border-indigo-400/30"
                                >
                                    <div className="bg-white/10 p-2 rounded-lg">🗝️</div>
                                    Import Existing Account or Wallet
                                </button>
                            )}

                            <button
                                onClick={() => setModalType("email")}
                                className="w-full flex items-center justify-center p-5 rounded-2xl font-black text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
                            >
                                {initialFlow === "signup" ? "Register with Email" : "Use Registered Email"}
                            </button>
                        </div>
                    </div>
                )}

                {modalType === "import" && (
                    <div className="space-y-8 py-4">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl font-black tracking-tighter">Import <span className="text-purple-500">Vault</span></h2>
                            <p className="text-gray-400 font-medium">Enter your 12-word recovery seed phrase.</p>
                        </div>

                        <form onSubmit={handleImportSeed} className="space-y-6">
                            <textarea
                                value={importSeed}
                                onChange={(e) => setImportSeed(e.target.value)}
                                placeholder="word1 word2 word3..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all h-32 resize-none"
                                required
                            />

                            {error && <p className="text-red-400 text-sm font-bold bg-red-400/10 p-4 rounded-xl border border-red-400/20">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black py-5 rounded-2xl font-black text-xl hover:scale-[1.02] transition-all shadow-xl active:scale-95 disabled:opacity-50"
                            >
                                {loading ? "Syncing..." : "Access Wallet"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setModalType("choice")}
                                className="w-full text-gray-500 font-black text-xs uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Go Back
                            </button>
                        </form>
                    </div>
                )}

                {modalType === "seed" && (
                    <div className="space-y-8 py-4">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl font-black tracking-tighter">Secure <span className="text-indigo-400">Recovery</span></h2>
                            <p className="text-gray-400 font-medium font-mono text-xs uppercase tracking-widest italic">Sector Verified</p>
                        </div>

                        <div className="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-3xl space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {seedData?.seedPhrase?.split(" ").map((word, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center gap-3">
                                        <span className="text-indigo-500/40 text-[10px] font-black">{i + 1}</span>
                                        <span className="font-bold text-gray-200 text-sm">{word}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl">
                            <p className="text-amber-500 text-xs font-bold leading-relaxed">
                                <span className="font-black uppercase tracking-widest block mb-1">⚠️ Mortal Warning</span>
                                If you lose this 12-word seed, your assets will be lost in the void forever. We cannot recover them.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(seedData?.seedPhrase || "");
                                    alert("Seed phrase copied to secure clipboard!");
                                }}
                                className="w-full bg-white/5 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                            >
                                Copy Phrase
                            </button>
                            <button
                                onClick={confirmSeedphrase}
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all"
                            >
                                {loading ? "Finalizing..." : "I Have Stored the Phrase"}
                            </button>
                        </div>
                    </div>
                )}

                {modalType === "email" && (
                    <div className="space-y-8 py-4">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl font-black tracking-tighter">
                                {initialFlow === "signup" ? "New " : "Email "}
                                <span className="text-indigo-500">Access</span>
                            </h2>
                            <p className="text-gray-400 font-medium">Enter your credentials below.</p>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[.2em] text-gray-500 mb-2 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[.2em] text-gray-500 mb-2 ml-1">Secure Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-400 text-sm font-bold bg-red-400/10 p-4 rounded-xl border border-red-400/20">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black py-5 rounded-2xl font-black text-xl hover:scale-[1.02] transition-all shadow-xl active:scale-95 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : initialFlow === "signup" ? "Create Account" : "Sign In"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setModalType("choice")}
                                className="w-full text-gray-500 font-black text-xs uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Go Back
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
