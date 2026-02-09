"use client";

import { useAuth } from "../hooks/useAuth";
import { useWallet } from "../hooks/useWallet";
import { useState } from "react";

export default function SettingsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { logout, updateProfile } = useAuth();
    const { address, isCustom } = useWallet();
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({ username, bio });
            setIsEditing(false);
            alert("Profile Uplink Successful!");
        } catch (err) {
            alert("Update Failed: " + (err as any).message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex justify-end animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-[#0a0a0b] border-l border-white/10 p-8 flex flex-col h-full shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        <h2 className="text-2xl font-black tracking-[0.2em] text-white uppercase italic">Console</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Identity Module */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Identity Module</span>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="text-[10px] font-black text-gray-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">Edit</button>
                            ) : (
                                <button onClick={handleSave} disabled={isSaving} className="text-[10px] font-black text-green-400 hover:text-green-300 transition-colors uppercase tracking-widest disabled:opacity-50">
                                    {isSaving ? "Syncing..." : "Save"}
                                </button>
                            )}
                        </div>

                        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-3xl border-2 border-white/10 shadow-2xl relative group">
                                    🧑‍🚀
                                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                        <span className="text-[8px] font-black uppercase tracking-tighter">New Hologram</span>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Enter Alias"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <h3 className="text-lg font-black text-white truncate">{username || "Unknown Entity"}</h3>
                                    )}
                                    <p className="text-[10px] font-mono text-indigo-400 truncate opacity-60 mt-1">{address}</p>
                                </div>
                            </div>

                            {isEditing ? (
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Write your mission objective..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-medium text-gray-400 outline-none focus:ring-1 focus:ring-indigo-500 h-24 resize-none"
                                />
                            ) : (
                                <p className="text-xs text-gray-500 leading-relaxed font-medium italic">
                                    {bio || "Status: Active. No mission logs found."}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Operational Guard */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500">Operational Guard</span>
                        <div className="grid grid-cols-1 gap-3">
                            {isCustom && (
                                <button className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-black py-4 rounded-2xl border border-indigo-500/20 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95">
                                    🗝️ Export Identity Key
                                </button>
                            )}
                            <button className="w-full bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-4 rounded-2xl border border-white/10 transition-all text-[10px] uppercase tracking-widest active:scale-95">
                                🌐 Switch Data Network
                            </button>
                        </div>
                    </div>

                    {/* External Uplinks */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">External Uplinks</span>
                        <div className="space-y-2">
                            {['Documentation', 'Discord Terminal', 'Substack Broadcast'].map(link => (
                                <div key={link} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                    <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-widest">{link}</span>
                                    <svg className="w-3 h-3 text-gray-600 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 mt-auto">
                    <button
                        onClick={logout}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black py-5 rounded-2xl border border-red-500/20 transition-all text-xs uppercase tracking-[0.3em] shadow-lg shadow-red-500/5 active:scale-95"
                    >
                        Disconnect Terminal
                    </button>
                    <p className="text-[8px] text-center text-gray-700 font-black mt-6 tracking-widest uppercase opacity-40">System Release v2.0.4-VOID</p>
                </div>
            </div>
        </div>
    );
}
