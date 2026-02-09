
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import AuthModals from "./components/AuthModals";

export default function Home() {
  const { ready, authenticated } = useAuth();
  const router = useRouter();

  const [modalType, setModalType] = useState<"seed" | "email" | null>(null);

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] opacity-20 delay-1000 animate-pulse"></div>
      </div>

      <div className="z-10 text-center space-y-8 p-6 max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 animate-in zoom-in duration-700">
            Dropz
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            The Ultimate Airdrop Platform. Scalable. Fast. Secure.<br />
            <span className="text-indigo-400 font-medium">Create. Distribute. Claim.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left py-8">
          <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105">
            <div className="h-10 w-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 text-2xl">🚀</div>
            <h3 className="text-xl font-bold mb-2">Create Airdrops</h3>
            <p className="text-gray-400 text-sm">Launch your token campaigns in seconds with instant smart contract deployment.</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-2xl">🔐</div>
            <h3 className="text-xl font-bold mb-2">Secure Login</h3>
            <p className="text-gray-400 text-sm">Access seamlessly with Seed Phrase or Email. Powered by Ethereum Security</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
            <div className="h-10 w-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 text-2xl">💰</div>
            <h3 className="text-xl font-bold mb-2">Instant Claims</h3>
            <p className="text-gray-400 text-sm">Users claim tokens directly to their wallets with low gas fees on Ethereum/Sepolia.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setModalType("seed")}
            disabled={!ready || authenticated}
            className="group w-full md:w-auto px-8 py-4 bg-white text-indigo-900 font-bold rounded-2xl text-lg shadow-lg hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            Create with Seedphrase
          </button>

          <button
            onClick={() => setModalType("email")}
            disabled={!ready || authenticated}
            className="group w-full md:w-auto px-8 py-4 bg-indigo-600/20 backdrop-blur-md border border-indigo-500/30 text-white font-bold rounded-2xl text-lg shadow-lg hover:bg-indigo-600/30 hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            Create with Email
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">Powered by Ethereum & Next.js</p>
      </div>

      <AuthModals
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType || "seed"}
      />
    </main>
  );
}
