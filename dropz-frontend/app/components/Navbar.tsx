"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useWallet } from "../hooks/useWallet";
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";
import SettingsPanel from "./SettingsPanel";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { address } = useWallet();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <Link href="/dashboard" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tighter hover:opacity-80 transition-opacity">
                        DROPZ
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/dashboard/airdrops" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Explorer</Link>
                        <Link href="/dashboard/create" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Launch</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-4 py-2 rounded-xl border border-white/5 transition-all flex items-center gap-2 group"
                    >
                        <span className="text-lg">🔍</span>
                        <span className="text-xs font-black uppercase tracking-widest hidden lg:block">Search Sector</span>
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded ml-2 font-mono group-hover:bg-white/20">⌘K</span>
                    </button>

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all text-xl"
                    >
                        ⚙️
                    </button>

                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white/10 flex items-center justify-center text-xs font-black cursor-pointer hover:rotate-12 transition-transform">
                        {address?.slice(2, 4).toUpperCase() || "U"}
                    </div>
                </div>
            </div>

            {/* Sub-components */}
            {isSearchOpen && <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
            {isSettingsOpen && <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
        </nav>
    );
}
