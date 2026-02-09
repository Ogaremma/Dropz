"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ users: any[], airdrops: any[] }>({ users: [], airdrops: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults({ users: [], airdrops: [] });
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const [uRes, aRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://dropz.onrender.com'}/users/search?q=${query}`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://dropz.onrender.com'}/airdrops/search?q=${query}`)
                ]);
                const users = await uRes.json();
                const airdrops = await aRes.json();
                setResults({ users: Array.isArray(users) ? users : [], airdrops: Array.isArray(airdrops) ? airdrops : [] });
            } catch (e) {
                console.error("Search failed", e);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-6 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(79,70,229,0.2)] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center gap-4">
                    <span className="text-2xl">🔍</span>
                    <input
                        autoFocus
                        placeholder="Search users, airdrops, or signals..."
                        className="w-full bg-transparent border-none outline-none text-xl font-bold text-white placeholder:text-gray-700"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {loading && <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-8 custom-scrollbar">
                    {query.length < 2 ? (
                        <div className="py-20 text-center space-y-4">
                            <p className="text-gray-500 font-bold">Scanning for galactic data...</p>
                            <div className="flex justify-center gap-2">
                                <span className="bg-white/5 px-3 py-1 rounded-lg text-[10px] text-gray-400 font-black uppercase tracking-widest border border-white/5">Users</span>
                                <span className="bg-white/5 px-3 py-1 rounded-lg text-[10px] text-gray-400 font-black uppercase tracking-widest border border-white/5">Missions</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {results.users.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-4">Authorized Personnel</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {results.users.map((user, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                                <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-lg">👨‍🚀</div>
                                                <div className="flex-1">
                                                    <p className="text-white font-bold">{user.email || "Fragmented Identity"}</p>
                                                    <p className="text-[10px] font-mono text-gray-500 truncate">{user.wallet}</p>
                                                </div>
                                                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Visual Profile</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.airdrops.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 ml-4">Active Missions</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {results.airdrops.map((drop, i) => (
                                            <Link href={`/dashboard/airdrops/${i}`} key={i} onClick={onClose} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                                <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center text-lg">🚀</div>
                                                <div className="flex-1">
                                                    <p className="text-white font-bold">{drop.name || drop.tokenName}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Rewards: {drop.totalAmount} UNITS</p>
                                                </div>
                                                <button className="text-[10px] font-black uppercase tracking-widest text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">Deploy & Join</button>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.users.length === 0 && results.airdrops.length === 0 && (
                                <div className="py-20 text-center">
                                    <p className="text-gray-500 font-bold">No matching signatures found in this sector.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center px-8">
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Orbital Search Console v1.0</p>
                    <div className="flex gap-4">
                        <span className="text-[10px] text-gray-600 font-bold flex items-center gap-1">
                            <span className="bg-white/5 px-1 rounded border border-white/10 uppercase">Esc</span> Close
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
