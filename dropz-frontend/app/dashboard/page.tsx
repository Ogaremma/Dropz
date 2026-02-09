"use client";

import { useWallet } from "../hooks/useWallet";
import { useAuth } from "../hooks/useAuth";
import { useState, useCallback } from "react";
import { useBalance, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { ethers } from "ethers";
import Link from "next/link";
import TransactionHistory from "../components/TransactionHistory";

export default function Dashboard() {
    const { address, isCustom, provider: customSigner } = useWallet();
    const { user, logout, authenticated, ready } = useAuth();
    const { data: balance, refetch: refetchBalance } = useBalance({
        address: address as `0x${string}`,
        watch: true
    });

    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [isInternalSending, setIsInternalSending] = useState(false);
    const [isInternalSuccess, setIsInternalSuccess] = useState(false);

    const { sendTransactionAsync } = useSendTransaction();

    const logTransaction = async (hash: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://dropz.onrender.com'}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wallet: address,
                    type: 'SEND',
                    amount: amount,
                    recipient: recipient,
                    transactionHash: hash,
                    status: 'CONFIRMED'
                })
            });
        } catch (e) {
            console.error("Failed to log transaction", e);
        }
    };

    const handleSend = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient || !amount || !address) return;

        setIsInternalSending(true);
        try {
            let hash = "";

            if (isCustom && customSigner) {
                // Custom Seedphrase Wallet Flow (Ethers)
                const signer = customSigner as any as ethers.Wallet;
                const tx = await signer.sendTransaction({
                    to: recipient,
                    value: ethers.parseEther(amount)
                });
                await tx.wait();
                hash = tx.hash;
            } else {
                // Privy/Wagmi Embedded Wallet Flow
                const result = await sendTransactionAsync({
                    to: recipient as `0x${string}`,
                    value: parseEther(amount),
                });
                hash = result.hash;
            }

            if (hash) {
                await logTransaction(hash);
                setIsInternalSuccess(true);
                refetchBalance();
                // We'll also need a way to refresh TransactionHistory, 
                // but since it polls every 10s it will show up shortly.
            }
        } catch (error) {
            console.error("Send failed", error);
            alert("Transaction failed: " + (error as any).message);
        } finally {
            setIsInternalSending(false);
        }
    }, [recipient, amount, address, isCustom, customSigner, sendTransactionAsync, refetchBalance]);

    if (!ready) return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (!authenticated) return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-8">
            <div className="text-center space-y-6 max-w-md w-full">
                <div className="text-8xl bg-indigo-500/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10 animate-bounce">🔒</div>
                <h2 className="text-4xl font-black tracking-tighter">Access Denied</h2>
                <p className="text-gray-400 font-medium">Please sign in to access your secure Dropz terminal.</p>
                <Link href="/" className="inline-block w-full bg-white text-black px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl active:scale-95">Back to Command Center</Link>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#050505] text-white p-6 md:p-10 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] delay-1000 animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                <header className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tighter">Dashboard</h1>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Connected User</span>
                            <span className="text-sm text-gray-200 font-bold">
                                {(user as any)?.email?.address || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Developer")}
                            </span>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-3 rounded-2xl hover:bg-red-500/20 transition-all font-black text-sm uppercase tracking-wider"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Wallet Card - 7 Columns */}
                    <div className="lg:col-span-7 group bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-[2px] rounded-[3rem] shadow-[0_0_50px_rgba(79,70,229,0.2)] hover:shadow-[0_0_80px_rgba(79,70,229,0.4)] transition-all duration-700">
                        <div className="bg-[#0a0a0c] backdrop-blur-3xl p-10 rounded-[2.95rem] h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none blur-3xl"></div>

                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-indigo-400 mb-4 font-black text-xs uppercase tracking-[0.3em]">Total Balance</h2>
                                    <p className="text-7xl font-black tracking-tighter text-white">
                                        {balance ? `${parseFloat(balance.formatted).toFixed(4)}` : "0.0000"}
                                        <span className="text-3xl text-indigo-500/60 ml-3">{balance?.symbol || "ETH"}</span>
                                    </p>
                                </div>
                                <div className="bg-indigo-500/10 p-4 rounded-3xl border border-indigo-500/20">
                                    <span className="text-2xl text-white">💎</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-indigo-200 text-sm font-bold bg-indigo-500/5 inline-flex px-5 py-3 rounded-2xl border border-indigo-500/10 mb-12 select-all cursor-pointer hover:bg-indigo-500/10 transition-colors">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                                {address}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <button
                                    onClick={() => setIsDepositModalOpen(true)}
                                    className="bg-white text-black py-5 rounded-[1.5rem] font-black text-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1"
                                >
                                    Deposit
                                </button>
                                <button
                                    onClick={() => setIsSendModalOpen(true)}
                                    className="bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-indigo-500 shadow-2xl shadow-indigo-600/30 transition-all border border-indigo-400/30 transform hover:-translate-y-1"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History - 5 Columns */}
                    <div className="lg:col-span-5">
                        <TransactionHistory />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Quick Actions - 7 Columns */}
                    <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-black mb-10 text-white flex items-center gap-4">
                            <span className="w-2 h-8 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></span>
                            Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href="/dashboard/create" className="group flex items-center gap-6 p-6 rounded-[2rem] bg-indigo-500/5 hover:bg-indigo-500/10 transition-all border border-white/5 hover:border-indigo-500/40">
                                <div className="text-5xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">🚀</div>
                                <div>
                                    <span className="font-black text-white text-xl block mb-1">Create Airdrop</span>
                                    <span className="text-sm text-gray-500 font-medium">Launch mission</span>
                                </div>
                            </Link>
                            <Link href="/dashboard/airdrops" className="group flex items-center gap-6 p-6 rounded-[2rem] bg-purple-500/5 hover:bg-purple-500/10 transition-all border border-white/5 hover:border-purple-500/40">
                                <div className="text-5xl group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">🎁</div>
                                <div>
                                    <span className="font-black text-white text-xl block mb-1">Active Drops</span>
                                    <span className="text-sm text-gray-500 font-medium">Claim rewards</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modals - Ultra Dark Premium Themed */}
            {isDepositModalOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-6 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="bg-[#0a0a0b] border border-white/10 rounded-[3.5rem] p-12 max-w-lg w-full shadow-[0_0_100px_rgba(79,70,229,0.15)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                        <h3 className="text-4xl font-black mb-6 text-white tracking-tighter">Deposit <span className="text-indigo-500">ETH</span></h3>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">Send Sepolia testnet ETH to your secure vault address below.</p>

                        <div className="bg-white/[0.03] p-8 rounded-[2rem] mb-10 font-mono text-sm break-all border border-white/5 text-center select-all text-indigo-300 shadow-inner group relative">
                            {address}
                            <div className="mt-4 text-[10px] text-gray-600 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Select to copy</div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => { navigator.clipboard.writeText(address || ""); alert("Address Copied!"); }}
                                className="w-full bg-white text-black py-5 rounded-2xl hover:scale-[1.02] transition-all font-black text-xl shadow-2xl shadow-indigo-600/10 active:scale-95"
                            >
                                Copy Secure Address
                            </button>
                            <button
                                onClick={() => setIsDepositModalOpen(false)}
                                className="w-full py-5 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all font-black uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isSendModalOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-6 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="bg-[#0a0a0b] border border-white/10 rounded-[3.5rem] p-12 max-w-lg w-full shadow-[0_0_100px_rgba(79,70,229,0.15)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                        <h3 className="text-4xl font-black mb-6 text-white tracking-tighter">Send <span className="text-purple-500">ETH</span></h3>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">Move assets across the decentralized network instantly.</p>

                        {isInternalSuccess ? (
                            <div className="text-center py-10 animate-in zoom-in-95 duration-700">
                                <div className="text-8xl mb-8 bg-green-500/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-2xl shadow-green-500/20">✓</div>
                                <h4 className="text-3xl font-black text-white mb-3">Mission Successful</h4>
                                <p className="text-gray-500 mb-10 font-bold">Your transaction has been beamed to the blockchain.</p>
                                <button
                                    onClick={() => { setIsSendModalOpen(false); setIsInternalSuccess(false); setRecipient(""); setAmount(""); }}
                                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                                >
                                    Verify & Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSend} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-1">Recipient Address</label>
                                    <input
                                        type="text"
                                        placeholder="0x..."
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white font-bold placeholder:text-gray-700 text-lg"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-1">Amount (ETH)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.0001"
                                            placeholder="0.0"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white font-black placeholder:text-gray-700 text-2xl pr-16"
                                            required
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-indigo-500/40 text-sm">ETH</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isInternalSending}
                                        className="w-full bg-white text-black py-6 rounded-2xl hover:scale-[1.02] transition-all font-black text-xl disabled:opacity-50 shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        {isInternalSending ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                                                Broadcasting...
                                            </>
                                        ) : "Confirm Transfer"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsSendModalOpen(false)}
                                        className="w-full py-5 rounded-2xl text-gray-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs"
                                    >
                                        Abort Mission
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
