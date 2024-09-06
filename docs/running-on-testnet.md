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
    - New RPC URL: "http://localhost:9946"
    - Chain ID: "945" (This is UTF-8 encoding for Alpha character)
    - Currency symbol: "TAO" 
  - Click Save









5. Locate your ss58 address (Example: 5H3qhPGzKMNV9fTPuizxzp8azyFRMd4BnheSuwN9Qxb5Cz3u). You need to have the private key for this address setup in Polkadot JS extension.


