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
        <main className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Live Airdrops</h1>
                        <p className="text-gray-500 mt-2">Explore and claim from active campaigns.</p>
                    </div>
                    <Link
                        href="/dashboard/create"
                        className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                    >
                        + Create New
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {airdrops.map((drop, i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition">
                                    🎁
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Active
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1">{drop.tokenName}</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Total Pool: <span className="font-mono text-gray-700">{drop.totalAmount.toString()}</span>
                            </p>

                            <Link
                                href={`/dashboard/airdrops/${i}`}
                                className="block w-full text-center bg-indigo-50 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-100 transition"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}

                    {airdrops.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg mb-4">No active airdrops found.</p>
                            <Link href="/dashboard/create" className="text-indigo-600 font-bold hover:underline">
                                Be the first to launch one!
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
