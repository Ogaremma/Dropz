"use client";

import { useWallet } from "../hooks/useWallet";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useBalance, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import Link from "next/link";

export default function Dashboard() {
    const { address, isCustom } = useWallet();
    const { user, logout, authenticated, ready } = useAuth();
    const { data: balance } = useBalance({ address: address as `0x${string}` });

    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);

    // Send State
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const { sendTransaction, isLoading: isSending, isSuccess } = useSendTransaction();

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            sendTransaction({
                to: recipient,
                value: parseEther(amount),
            });
        } catch (error) {
            console.error("Send failed", error);
        }
    };

    if (!ready) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!authenticated) return <div className="p-8">Not authenticated</div>;

    return (
        <main className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden md:block">
                            {(user as any)?.email?.address || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "User")}
                        </span>
                        <button
                            onClick={logout}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Wallet Card */}
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                        <h2 className="text-gray-300 mb-2 font-medium">Your Wallet</h2>
                        <div className="mb-6">
                            <p className="text-4xl font-bold tracking-tight">
                                {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "0.00 ETH"}
                            </p>
                            <p className="text-white/60 text-sm mt-1 font-mono bg-black/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                                {address}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDepositModalOpen(true)}
                                className="flex-1 bg-white text-indigo-900 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg"
                            >
                                Deposit
                            </button>
                            <button
                                onClick={() => setIsSendModalOpen(true)}
                                className="flex-1 bg-indigo-600/50 border border-white/20 text-white py-3 rounded-xl font-bold hover:bg-indigo-600/70 transition backdrop-blur-md"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/dashboard/create" className="group p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition border border-indigo-100">
                                <span className="text-2xl mb-2 block">🚀</span>
                                <span className="font-bold text-indigo-900 block">Create Airdrop</span>
                                <span className="text-xs text-indigo-600">Launch new token campaign</span>
                            </Link>
                            <Link href="/dashboard/airdrops" className="group p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 transition border border-purple-100">
                                <span className="text-2xl mb-2 block">🎁</span>
                                <span className="font-bold text-purple-900 block">Claim Airdrops</span>
                                <span className="text-xs text-purple-600">View active campaigns</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Deposit Modal */}
                {isDepositModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-bold mb-4">Deposit ETH</h3>
                            <p className="text-gray-500 mb-6">Send ETH to your wallet address below to top up your balance.</p>
                            <div className="bg-gray-100 p-4 rounded-xl mb-6 font-mono text-sm break-all border border-gray-200 text-center select-all">
                                {address}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { navigator.clipboard.writeText(address || ""); alert("Copied!"); }}
                                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium"
                                >
                                    Copy Address
                                </button>
                                <button
                                    onClick={() => setIsDepositModalOpen(false)}
                                    className="px-6 py-3 rounded-xl hover:bg-gray-100 transition font-medium color-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Send Modal */}
                {isSendModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-bold mb-4">Send ETH</h3>
                            <p className="text-gray-500 mb-6">Enter recipient address and amount.</p>

                            {isSuccess ? (
                                <div className="text-center py-4">
                                    <div className="text-4xl mb-4">✅</div>
                                    <p className="font-bold text-lg">Transaction Sent!</p>
                                    <button
                                        onClick={() => { setIsSendModalOpen(false); window.location.reload(); }}
                                        className="mt-6 w-full bg-gray-100 py-3 rounded-xl font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSend} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
                                        <input
                                            type="text"
                                            placeholder="0x..."
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ETH)</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            placeholder="0.0"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSending}
                                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                                        >
                                            {isSending ? "Sending..." : "Send Now"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsSendModalOpen(false)}
                                            className="px-6 py-3 rounded-xl hover:bg-gray-100 transition font-medium text-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
