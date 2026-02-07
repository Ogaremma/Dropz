export const DROPZ_CONTRACT_ADDRESS = "0xPASTE_YOUR_REAL_DEPLOYED_ADDRESS_HERE";

export const DROPZ_ABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "tokenName", "type": "string" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "createAirdrop",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllAirdrops",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "id", "type": "uint256" },
                    { "internalType": "string", "name": "tokenName", "type": "string" },
                    { "internalType": "uint256", "name": "amount", "type": "uint256" },
                    { "internalType": "address", "name": "creator", "type": "address" }
                ],
                "internalType": "struct DropzAirdrop.Airdrop[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "airdropId", "type": "uint256" }],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
