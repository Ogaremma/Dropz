"use client";

import { useState } from "react";
import { useDropzContract } from "../../../hooks/useDropzContract";
import { useWalletClient } from "wagmi";
import { useRouter } from "next/navigation";

export default function CreateAirdrop() {
    const { address, abi } = useDropzContract();
    const { data: walletClient } = useWalletClient();
    const router = useRouter();

    const [tokenName, setTokenName] = useState("");
    const [amount, setAmount] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    async function createAirdrop(e: React.FormEvent) {
        e.preventDefault();
        if (!walletClient) return alert("Connect wallet");

        try {
            setIsCreating(true);
            await walletClient.writeContract({
                address,
                abi,
                functionName: "createAirdrop",
                args: [tokenName, BigInt(amount)],
            });

            alert("Airdrop created successfully!");
            router.push("/dashboard/airdrops");
        } catch (error) {
            console.error("Failed to create airdrop", error);
            alert("Failed to create airdrop. See console for details.");
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] delay-1000 animate-pulse"></div>
            </div>

            <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                    <h1 className="text-4xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tighter">Create Mission</h1>
                    <p className="text-gray-400 mb-10 font-bold">Launch a new token airdrop campaign to the community.</p>

                    <form onSubmit={createAirdrop} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-1">Token Name</label>
                            <input
                                placeholder="e.g. Supernova Token"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white font-bold placeholder:text-gray-700 text-lg"
                                value={tokenName}
                                onChange={(e) => setTokenName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-1">Total Supply to Airdrop</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="e.g. 1000000"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white font-black placeholder:text-gray-700 text-2xl pr-16"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-indigo-500/40 text-sm">UNIT</span>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full bg-white text-black py-6 rounded-2xl font-black text-xl hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                            >
                                {isCreating ? (
                                    <>
                                        <span className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin"></span>
                                        Initializing Mission...
                                    </>
                                ) : (
                                    <>🚀 Launch Airdrop</>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full mt-4 py-4 rounded-2xl text-gray-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs"
                            >
                                Cancel & Return
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-[2rem] text-center">
                    <p className="text-xs text-indigo-400/60 font-bold uppercase tracking-widest">
                        Smart Contract Deployment is Automatic & Instant
                    </p>
                </div>
            </div>
        </div>
    );
}
