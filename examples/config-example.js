// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const ethPrivateKey = "0000000000000000000000000000000000000000000000000000000000000001";
const subSeed = "//Alice";
const rpcUrlLocal = 'http://127.0.0.1:9946';
const rpcUrlTestnet = 'https://evm-testnet.dev.opentensor.ai';
const wsUrlLocal = 'ws://127.0.0.1:9946';
const wsUrlTestnet = 'wss://evm-testnet.dev.opentensor.ai';

module.exports = {
    ethPrivateKey,
    subSeed,
    rpcUrl: rpcUrlTestnet,
    wsUrl: wsUrlTestnet,
}
