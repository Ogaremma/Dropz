import { useWallets } from "@privy-io/react-auth";

export function useWallet() {
    const { wallets } = useWallets();
    const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
    );

    return {
        wallet: embeddedWallet,
        address: embeddedWallet?.address,
    };
}
