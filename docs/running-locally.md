# Testing with a local Subtensor devnet

## 1. Run EVM-enabled localnet

```bash
git clone https://github.com/opentensor/subtensor
git checkout feat/evm-devnet-ready
./scripts/localnet.sh
```

## 2. Setup Metamask

1. You should have Metamask installed
2. Create a new account
3. Setup the network:
  - Open Metamask settings
  - Click on "Add a network manually"
  - Enter 
    - Network name: "Subtensor"
    - New RPC URL: http://localhost:9946
    - Chain ID: "945" (This is UTF-8 encoding for Alpha character)
    - Currency symbol: "TAO" 
  - Click Save

## 3. Configure secrets, addresses, and RPC endpoint

1. Make sure you have at least one address configured in Metamask. If you don't have Metamask installed, you need to install it first.
2. Create config.js file by copying the config-example.js file:

```bash
cp config-example.js config.js
```

3. Locate your H160 account address in Metamask (Example: 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf) and its private key (Example: 0000000000000000000000000000000000000000000000000000000000000001)
4. Copy the private key into `ethPrivateKey` string in your config.js file like that:

```javascript
const ethPrivateKey = "0000000000000000000000000000000000000000000000000000000000000001";
```

5. Specify local endpoint for RPC and WS URLs in your config.js file:

```javascript
module.exports = {
    ethPrivateKey,
    subSeed,
    rpcUrl: rpcUrlLocal,
    wsUrl: wsUrlLocal,
}
```
