import { useEffect, useState } from "react";
import { useDropzContract } from "./useDropzContract";

export interface Airdrop {
    id: bigint;
    tokenName: string;
    totalAmount: bigint;
    creator: string;
}

export function useAirdrops() {
    const { publicClient, address, abi } = useDropzContract();
    const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAirdrops() {
            try {
                const data = await publicClient.readContract({
                    address: address as `0x${string}`,
                    abi,
                    functionName: "getAllAirdrops",
                });

                setAirdrops(data as Airdrop[]);
            } catch (err) {
                console.error("Failed to fetch airdrops:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAirdrops();
    }, [publicClient, address, abi]);

    return { airdrops, loading };
}
