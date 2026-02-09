
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

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
          <button
            onClick={() => setModalType("seed")}
            disabled={!ready || authenticated}
            className="group relative w-full md:w-80 px-8 py-6 bg-white text-black font-black rounded-[2rem] text-xl shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-500 disabled:opacity-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-3">
              🚀 Access with Seedphrase
            </span>
          </button>

          <button
            onClick={() => setModalType("seed")} // Set to seed to trigger the unified choice modal
            disabled={!ready || authenticated}
            className="group relative w-full md:w-80 px-8 py-6 bg-indigo-600 text-white font-black rounded-[2rem] text-xl shadow-[0_0_50px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:scale-105 transition-all duration-500 disabled:opacity-50 border border-indigo-400/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.144 1.144-2.924 2.456-6.248 2.456-5.344 0-9.44-4.34-10.412-9.676-.084-.464-.128-.948-.128-1.44s.044-.976.128-1.44c.972-5.336 5.068-9.676 10.412-9.676 3.1 0 5.392 1.196 7.1 2.8l2.264-2.264C18.428 1.132 15.656 0 12.24 0 5.484 0 0 5.484 0 12.24s5.484 12.24 12.24 12.24c3.684 0 6.64-1.216 8.8-3.468 2.216-2.216 2.928-5.328 2.928-7.792 0-.74-.064-1.452-.184-2.12h-11.304v-.18z" /></svg>
              Login with Gmail
            </span>
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
