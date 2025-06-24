import { createPublicClient, http } from "viem";

// Source: https://github.com/opentensor/subtensor/blob/main/evm-tests/src/contracts/metagraph.ts
const IMETAGRAPH_ADDRESS = "0x0000000000000000000000000000000000000802";

const IMetagraphABI = [
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getAxon",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint64",
                        name: "block",
                        type: "uint64",
                    },
                    {
                        internalType: "uint32",
                        name: "version",
                        type: "uint32",
                    },
                    {
                        internalType: "uint128",
                        name: "ip",
                        type: "uint128",
                    },
                    {
                        internalType: "uint16",
                        name: "port",
                        type: "uint16",
                    },
                    {
                        internalType: "uint8",
                        name: "ip_type",
                        type: "uint8",
                    },
                    {
                        internalType: "uint8",
                        name: "protocol",
                        type: "uint8",
                    },
                ],
                internalType: "struct AxonInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getColdkey",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getConsensus",
        outputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getDividends",
        outputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getEmission",
        outputs: [
            {
                internalType: "uint64",
                name: "",
                type: "uint64",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getHotkey",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getIncentive",
        outputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getIsActive",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getLastUpdate",
        outputs: [
            {
                internalType: "uint64",
                name: "",
                type: "uint64",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getRank",
        outputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getStake",
        outputs: [
            {
                internalType: "uint64",
                name: "",
                type: "uint64",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getTrust",
        outputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
        ],
        name: "getUidCount",
        outputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getValidatorStatus",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint16",
                name: "netuid",
                type: "uint16",
            },
            {
                internalType: "uint16",
                name: "uid",
                type: "uint16",
            },
        ],
        name: "getVtrust",
        outputs: [
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

async function main() {
    // Initialize the public client
    const publicClient = createPublicClient({
        transport: http("https://test.chain.opentensor.ai")
    });

    // Test parameters
    const subnetId = 1;  // Example subnet ID
    const uid = 0;       // Example neuron UID

    try {
        // Get network information
        console.log("\n=== Network Information ===");
        const uidCount = await publicClient.readContract({
            abi: IMetagraphABI,
            address: IMETAGRAPH_ADDRESS,
            functionName: "getUidCount",
            args: [subnetId]
        });
        console.log(`Total neurons in subnet ${subnetId}: ${uidCount}`);

        // Get neuron metrics
        console.log("\n=== Neuron Metrics ===");
        const [stake, emission, rank, trust, consensus, incentive, dividends] = await Promise.all([
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getStake",
                args: [subnetId, uid]
            }),
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getEmission",
                args: [subnetId, uid]
            }),
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getRank",
                args: [subnetId, uid]
            }),
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getTrust",
                args: [subnetId, uid]
            }),
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getConsensus",
                args: [subnetId, uid]
            }),
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getIncentive",
                args: [subnetId, uid]
            }),
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getDividends",
                args: [subnetId, uid]
            })
        ]);

        console.log(`Neuron ${uid} Metrics:`);
        console.log(`- Stake: ${stake}`);
        console.log(`- Emission: ${emission}`);
        console.log(`- Rank: ${rank}`);
        console.log(`- Trust: ${trust}`);
        console.log(`- Consensus: ${consensus}`);
        console.log(`- Incentive: ${incentive}`);
        console.log(`- Dividends: ${dividends}`);

        // Get neuron connection information
        console.log("\n=== Neuron Connection Information ===");
        const axon = await publicClient.readContract({
            abi: IMetagraphABI,
            address: IMETAGRAPH_ADDRESS,
            functionName: "getAxon",
            args: [subnetId, uid]
        });
        console.log("Axon Info:", {
            block: axon.block,
            version: axon.version,
            ip: axon.ip,
            port: axon.port,
            ipType: axon.ip_type,
            protocol: axon.protocol
        });

        // Check validator status
        console.log("\n=== Validator Status ===");
        const [isValidator, vtrust] = await Promise.all([
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getValidatorStatus",
                args: [subnetId, uid]
            }),
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getVtrust",
                args: [subnetId, uid]
            })
        ]);
        console.log(`Is Validator: ${isValidator}`);
        console.log(`Validator Trust: ${vtrust}`);

        // Get key information
        console.log("\n=== Key Information ===");
        const [hotkey, coldkey] = await Promise.all([
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getHotkey",
                args: [subnetId, uid]
            }),
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getColdkey",
                args: [subnetId, uid]
            })
        ]);
        console.log(`Hotkey: ${hotkey}`);
        console.log(`Coldkey: ${coldkey}`);

        // Get neuron state
        console.log("\n=== Neuron State ===");
        const [lastUpdate, isActive] = await Promise.all([
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getLastUpdate",
                args: [subnetId, uid]
            }),
            publicClient.readContract({
                abi: IMetagraphABI,
                address: IMETAGRAPH_ADDRESS,
                functionName: "getIsActive",
                args: [subnetId, uid]
            })
        ]);
        console.log(`Last Update Block: ${lastUpdate}`);
        console.log(`Is Active: ${isActive}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

main().catch(console.error); 