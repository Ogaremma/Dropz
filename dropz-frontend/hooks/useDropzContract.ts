import { usePublicClient } from "wagmi";
import { DROPZ_ABI, DROPZ_CONTRACT_ADDRESS } from "../lib/dropzContract";

export function useDropzContract() {
    const publicClient = usePublicClient();

    return {
        address: DROPZ_CONTRACT_ADDRESS as `0x${string}`,
        abi: DROPZ_ABI,
        publicClient,
    };
}
