"use client";

import { useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";

interface Transaction {
    type: 'SEND' | 'CLAIM' | 'CREATE' | 'DEPOSIT';
    amount: string;
    tokenName?: string;
    createdAt: string;
    status: string;
}

export default function TransactionHistory() {
    const { address } = useWallet();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!address) return;

        const fetchHistory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://dropz.onrender.com'}/transactions/${address}`);
                const data = await res.json();
                setTransactions(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error("Failed to fetch history", e);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

        // Polling as fallback
        const interval = setInterval(fetchHistory, 10000);

        // Listen for internal refresh events (e.g. from Dashboard after a send)
        window.addEventListener('dropz:tx-refresh', fetchHistory);

        return () => {
            clearInterval(interval);
            window.removeEventListener('dropz:tx-refresh', fetchHistory);
        };
    }, [address]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'SEND': return '📤';
            case 'CLAIM': return '💎';
            case 'CREATE': return '🚀';
            case 'DEPOSIT': return '📥';
            default: return '⚡';
        }
    };

    if (loading && transactions.length === 0) {
        return (
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl h-full flex flex-col justify-center items-center gap-4">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Syncing History...</p>
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl h-full">
            <h2 className="text-2xl font-black mb-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="w-2 h-8 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></span>
                    History
                </div>
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">Live Signal</span>
            </h2>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {transactions.length === 0 ? (
                    <div className="py-10 text-center">
                        <p className="text-gray-500 text-sm font-bold">No transmissions detected in this sector.</p>
                    </div>
                ) : (
                    transactions.map((tx, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group">
                            <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                {getIcon(tx.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-white">{tx.type} {tx.tokenName ? `- ${tx.tokenName}` : ""}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(tx.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-white">{tx.amount} <span className="text-[10px] text-indigo-400 uppercase">ETH</span></p>
                                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Confirmed</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
