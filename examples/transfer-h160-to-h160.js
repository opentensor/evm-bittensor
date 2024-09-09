const { ethers } = require('ethers');

// Enter your destination address here:
const destinationEthereumAddress = '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF';

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, rpcUrl } = require('../config.js');

// Connect to the Subtensor node
const provider = new ethers.JsonRpcProvider(rpcUrl);

// Create a signer
const privateKey = ethPrivateKey;  // DO NOT HARDCODE YOUR PRIVATE KEY IN PRODUCTION
const signer = new ethers.Wallet(privateKey, provider);

// Function to perform the transfer
async function makeTransfer() {
    try {
        console.log(`Sending balance `);
        console.log(`   from address: ${signer.address}`);
        console.log(`   to address:   ${destinationEthereumAddress}`);

        const balanceBefore = await provider.getBalance(destinationEthereumAddress);
        console.log("Recipient starting balance:", balanceBefore.toString());

        // Create a transfer transaction to send TAO
        const tx = {
            to: destinationEthereumAddress,
            value: "100000000000000000",
        };

        // Send the transaction
        const transactionResponse = await signer.sendTransaction(tx);
        console.log('Transaction response:', transactionResponse);

        // Wait for the transaction to be mined
        const receipt = await transactionResponse.wait();
        console.log('Transaction confirmed. Receipt: ', receipt);

        const balanceAfter = await provider.getBalance(destinationEthereumAddress);
        console.log("Recipient ending balance:", balanceAfter.toString());
    } catch (error) {
        console.error('Error:', error);
    }
}

async function main() {
    await makeTransfer();
}

main().catch(console.error);

