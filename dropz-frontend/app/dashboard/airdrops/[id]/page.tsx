"use client";

import { useAirdrops } from "../../../hooks/useAirdrops";
import { useDropzContract } from "../../../hooks/useDropzContract";
import { useWalletClient } from "wagmi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AirdropDetail({ params }: { params: { id: string } }) {
    const { airdrops, loading } = useAirdrops();
    const { address, abi } = useDropzContract();
    const { data: walletClient } = useWalletClient();
    const router = useRouter();
    const [isClaiming, setIsClaiming] = useState(false);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    const airdropIndex = parseInt(params.id);
    const airdrop = airdrops[airdropIndex];

    if (!airdrop) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white p-8">
            <div className="text-8xl mb-8">🔭</div>
            <h2 className="text-3xl font-black mb-4">Airdrop Not Found</h2>
            <button onClick={() => router.back()} className="bg-indigo-600 px-8 py-3 rounded-2xl font-black">Return to Fleet</button>
        </div>
    );

    async function claimAirdrop() {
        if (!walletClient) return alert("Connect wallet");

        try {
            setIsClaiming(true);
            await walletClient.writeContract({
                address,
                abi,
                functionName: "claimAirdrop",
                args: [BigInt(airdropIndex)],
            });
            alert("Reward claimed successfully!");
            router.push("/dashboard/airdrops");
        } catch (error) {
            console.error("Claim failed", error);
            alert("Claim failed. Ensure you are eligible or try again later.");
        } finally {
            setIsClaiming(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 flex items-center justify-center relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[120px] delay-1000 animate-pulse"></div>
            </div>

            <div className="max-w-xl w-full bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] shadow-[0_0_80px_rgba(79,70,229,0.15)] border border-white/10 text-center relative z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

                <div className="h-28 w-28 bg-indigo-500/10 rounded-full flex items-center justify-center text-6xl mx-auto mb-10 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                    🎁
                </div>

                <div className="space-y-4 mb-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Mission Reward</span>
                    <h1 className="text-5xl font-black tracking-tighter break-words text-white">{airdrop.tokenName}</h1>
                    <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Eligible for Claim</span>
                    </div>
                </div>

                <div className="bg-white/[0.03] p-8 rounded-[2rem] mb-12 border border-white/5 flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                    <div className="text-left">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Pool</p>
                        <p className="text-3xl font-black text-indigo-400 tracking-tighter">{airdrop.totalAmount.toString()}</p>
                    </div>
                    <div className="text-4xl text-white/10 group-hover:text-white/20 transition-colors">⚡</div>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={claimAirdrop}
                        disabled={isClaiming}
                        className="w-full bg-white text-black py-6 rounded-2xl font-black text-2xl hover:scale-[1.02] transition-all shadow-2xl shadow-white/5 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isClaiming ? (
                            <>
                                <span className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin"></span>
                                Claiming...
                            </>
                        ) : "Claim Now"}
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="w-full py-4 rounded-2xl text-gray-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs"
                    >
                        Return to Fleet
                    </button>
                </div>

                <p className="mt-10 text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
                    Secured by Dropz Smart Contracts
                </p>
            </div>
        </div>
    );
}
