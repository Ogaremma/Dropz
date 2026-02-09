"use client";

import { useAuth } from "../hooks/useAuth";
import { useWallet } from "../hooks/useWallet";

export default function SettingsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { logout } = useAuth();
    const { address, isCustom } = useWallet();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex justify-end animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-[#0a0a0b] border-l border-white/10 p-10 flex flex-col h-full shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-black tracking-tighter text-white">Console</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl">✕</button>
                </div>

                <div className="space-y-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Security Section */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Security Vault</span>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-300">Biometric Sign</span>
                                <div className="w-10 h-5 bg-indigo-500/20 rounded-full relative p-1 cursor-pointer">
                                    <div className="w-3 h-3 bg-indigo-500 rounded-full ml-auto" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-300">Auto-Burn Session</span>
                                <div className="w-10 h-5 bg-white/10 rounded-full relative p-1 cursor-pointer">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Export Section */}
                    {isCustom && (
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Data Export</span>
                            <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-3 active:scale-95">
                                🔑 Export Seedphrase
                            </button>
                            <p className="text-[10px] text-gray-600 text-center px-4">NEVER share your seedphrase. Dropz will never ask for it outside of this secure terminal.</p>
                        </div>
                    )}

                    {/* Profile Section */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">User Identity</span>
                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/5 text-center">
                            <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 border border-white/10 flex items-center justify-center text-3xl">🧑‍🚀</div>
                            <p className="text-xs font-mono text-indigo-300 truncate">{address}</p>
                            <button className="mt-4 text-[10px] font-black uppercase text-indigo-400 hover:text-white transition-colors">Edit Hologram Profile</button>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black py-4 rounded-xl border border-red-500/20 transition-all"
                    >
                        Disconnect Terminal
                    </button>
                </div>
            </div>
        </div>
    );
}
