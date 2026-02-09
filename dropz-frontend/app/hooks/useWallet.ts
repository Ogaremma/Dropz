import { useWallets } from "@privy-io/react-auth";
import { useMemo } from "react";
import { ethers } from "ethers";

export function useWallet() {
    const { wallets } = useWallets();
    const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
    );

    const customWalletData = useMemo(() => {
        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem("dropz_custom_wallet");
        if (!stored) return null;
        try {
            const { seed } = JSON.parse(stored);
            return ethers.Wallet.fromPhrase(seed);
        } catch (e) {
            return null;
        }
    }, []);

    // Return custom wallet info if it exists, otherwise fallback to Privy
    if (customWalletData) {
        return {
            wallet: {
                address: customWalletData.address,
                // Mock properties to match Privy wallet object structure where needed
                walletClientType: "custom",
                connectorType: "custom",
            },
            address: customWalletData.address,
            provider: customWalletData, // Ethers wallet can act as a signer/provider
            isCustom: true,
        };
    }

    return {
        wallet: embeddedWallet,
        address: embeddedWallet?.address,
        isCustom: false,
    };
}
