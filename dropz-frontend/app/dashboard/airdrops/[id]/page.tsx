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
        <div className="min-h-screen flex items-center justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const airdropIndex = parseInt(params.id);
    const airdrop = airdrops[airdropIndex];

    if (!airdrop) return <div className="p-10">Airdrop not found</div>;

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
            alert("Claimed successfully!");
            router.push("/dashboard/airdrops");
        } catch (error) {
            console.error("Claim failed", error);
            alert("Claim failed");
        } finally {
            setIsClaiming(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
                <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                    🎁
                </div>

                <h1 className="text-3xl font-bold mb-2 break-words">{airdrop.tokenName}</h1>
                <p className="text-gray-500 mb-8 uppercase tracking-wide text-xs font-bold">Airdrop Campaign</p>

                <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Pool</p>
                    <p className="text-2xl font-mono font-bold text-gray-800">{airdrop.totalAmount.toString()}</p>
                </div>

                <button
                    onClick={claimAirdrop}
                    disabled={isClaiming}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                    {isClaiming ? "Claiming..." : "Claim Tokens"}
                </button>

                <button
                    onClick={() => router.back()}
                    className="mt-4 text-gray-500 hover:text-gray-800 text-sm font-medium"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
