# Testing with a local Subtensor devnet

## 1. Setup Metamask

1. You should have Metamask installed
2. Create a new account
3. Setup the network:
  - Open Metamask settings
  - Click on "Add a network manually"
  - Enter 
    - Network name: "Subtensor"
    - New RPC URL: https://evm-testnet.dev.opentensor.ai
    - Chain ID: "945" (This is UTF-8 encoding for Alpha character)
    - Currency symbol: "TAO" 
    - Block explorer URL: https://evm-testscan.dev.opentensor.ai/
  - Click Save

## 2. Configure your address private key

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

## 3. Get testTAO token with faucet

TBD

