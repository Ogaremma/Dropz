"use client";

import { useAirdrops } from "../../hooks/useAirdrops";
import Link from "next/link";

export default function AirdropsPage() {
    const { airdrops, loading } = useAirdrops();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
    return (
        <main className="min-h-screen bg-[#050505] text-white p-6 md:p-10 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] delay-1000 animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tighter">Live Missions</h1>
                        <p className="text-gray-400 mt-2 font-bold">Explore and claim your rewards from the active fleet.</p>
                    </div>
                    <Link
                        href="/dashboard/create"
                        className="bg-white text-black px-8 py-4 rounded-2xl font-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center gap-2"
                    >
                        <span className="text-xl">+</span> Launch New
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {airdrops.map((drop, i) => (
                        <div
                            key={i}
                            className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(79,70,229,0.1)] transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="h-14 w-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition duration-500">
                                    🎁
                                </div>
                                <span className="bg-green-500/10 text-green-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-green-500/20">
                                    Online
                                </span>
                            </div>

                            <h3 className="text-2xl font-extrabold text-white mb-2 leading-tight">{drop.tokenName}</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-indigo-400 font-black uppercase tracking-widest">Pool Size</span>
                                    <span className="font-black text-gray-300 ml-auto">{drop.totalAmount.toString()} UNITS</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 w-2/3 h-full rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                                </div>
                            </div>

                            <Link
                                href={`/dashboard/airdrops/${i}`}
                                className="block w-full text-center bg-white/[0.03] text-white border border-white/10 font-black py-4 rounded-2xl group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all"
                            >
                                Details & Claim
                            </Link>
                        </div>
                    ))}

                    {airdrops.length === 0 && (
                        <div className="col-span-full text-center py-32 bg-white/5 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-white/10">
                            <div className="text-6xl mb-6">🏜️</div>
                            <p className="text-gray-400 text-xl mb-8 font-bold">The sector is currently quiet.</p>
                            <Link href="/dashboard/create" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                                Launch the First Mission
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
