const { ethers } = require('ethers');
const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { decodeAddress } = require('@polkadot/util-crypto');

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, subSeed, rpcUrl, wsUrl } = require('./config.js');

// Precompile smart contract address:
const contractAddress = '0x0000000000000000000000000000000000000800';

// Connect to the Subtensor node
const provider = new ethers.JsonRpcProvider(rpcUrl);

// This is the SubtensorBalanceTransfer smart contract ABI, located in subtensor repository at: 
// runtime/src/precompiles/balanceTransfer.abi
const abi = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "data",
                "type": "bytes32"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

// Create a signer
const privateKey = ethPrivateKey;  // DO NOT HARDCODE YOUR PRIVATE KEY IN PRODUCTION
const signer = new ethers.Wallet(privateKey, provider);

// Create a contract instance
const contract = new ethers.Contract(contractAddress, abi, signer);

// Function to perform the transfer
async function makeTransfer() {
    try {
        // Substrate ss58 address that will receive the transfer
        const wsProvider = new WsProvider(wsUrl);
        await ApiPromise.create({ provider: wsProvider });
        const keyring = new Keyring({ type: 'sr25519' });
        const account = keyring.addFromUri(subSeed); // Your Substrate address private key/seed

        // Destination address can be replaced with any ss58 address here:
        const destinationAddress = account.address;
        // const destinationAddress = "5H3qhPGzKMNV9fTPuizxzp8azyFRMd4BnheSuwN9Qxb5Cz3u";
        console.log(`Sending balance to ss58 address: ${destinationAddress}`);

        // Get the substrate address public key
        const pubk = decodeAddress(destinationAddress);
        const hex = Array.from(pubk, byte => byte.toString(16).padStart(2, '0')).join('');
        console.log(`pubk = ${hex}`);

        // Sending 1 TAO along with the transaction
        const tx = await contract.transfer(pubk, { value: "1000000000" });
        console.log('Transaction response:', tx);

        // Wait for the transaction to be mined
        await tx.wait();
        console.log('Transaction confirmed.');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function main() {
    await makeTransfer();
}

main().catch(console.error);

