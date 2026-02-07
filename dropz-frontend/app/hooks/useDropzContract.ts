import { publicClient } from "../lib/viem";
import { DROPZ_ABI, DROPZ_CONTRACT_ADDRESS } from "../lib/contract";

export function useDropzContract() {
    return {
        address: DROPZ_CONTRACT_ADDRESS as `0x${string}`,
        abi: DROPZ_ABI,
        publicClient,
    };
}
