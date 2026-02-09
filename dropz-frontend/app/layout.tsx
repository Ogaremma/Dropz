"use client";

import "./globals.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { chains, publicClient, webSocketPublicClient } from "../lib/wagmi";
import Navbar from "./components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050505]">
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            loginMethods: ["email"],
            appearance: {
              theme: "dark",
              accentColor: "#6366f1",
            },
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
          }}
        >
          <PrivyWagmiConnector wagmiChainsConfig={{ chains, publicClient, webSocketPublicClient }}>
            <Navbar />
            <div className="pt-20">
              {children}
            </div>
          </PrivyWagmiConnector>
        </PrivyProvider>
      </body>
    </html>
  );
}
