import { configureChains } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
export const { chains, publicClient, webSocketPublicClient } = configureChains(
    [sepolia],
    [publicProvider()]
);
