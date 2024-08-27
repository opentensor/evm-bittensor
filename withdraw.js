const { ethers } = require('ethers');
const { ethPrivateKey } = require('./secrets.js');
const { decodeAddress } = require('@polkadot/util-crypto');

// Substrate ss58 address that will receive the transfer
const destinationAddress = "5H3qhPGzKMNV9fTPuizxzp8azyFRMd4BnheSuwN9Qxb5Cz3u";

// Precompile smart contract address:
const contractAddress = '0x0000000000000000000000000000000000000800';

// Connect to the Subtensor node
const providerUrl = 'http://127.0.0.1:9946';
const provider = new ethers.JsonRpcProvider(providerUrl);

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
// Normally you would need the private key to send transactions
// Be careful to protect the private key and preferably load it from an environment variable
const privateKey = ethPrivateKey;  // DO NOT HARDCODE YOUR PRIVATE KEY IN PRODUCTION
const signer = new ethers.Wallet(privateKey, provider);

// Create a contract instance
const contract = new ethers.Contract(contractAddress, abi, signer);

// Function to perform the transfer
async function makeTransfer() {
    try {
        // Get the substrate address public key
        const pubk = decodeAddress(destinationAddress);

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

