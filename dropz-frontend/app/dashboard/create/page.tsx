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
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Create Airdrop</h1>
                <p className="text-gray-500 mb-8">Launch a new token airdrop campaign.</p>

                <form onSubmit={createAirdrop} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Token Name</label>
                        <input
                            placeholder="e.g. My Awesome Token"
                            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                        <input
                            type="number"
                            placeholder="e.g. 1000000"
                            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isCreating}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50"
                    >
                        {isCreating ? "Creating Airdrop..." : "🚀 Launch Airdrop"}
                    </button>
                </form>
            </div>
        </div>
    );
}
