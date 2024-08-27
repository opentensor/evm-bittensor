# EVM Demo

## 1. Run EVM-enabled localnet

```bash
git clone https://github.com/opentensor/subtensor
git checkout feat/evm-rpc
./scripts/localnet-evm.sh
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
    - Chain ID: "964" (This is UTF-8 encoding for Tao character)
    - Currency symbol: "TAO" 
  - Click Save

## Balance transfer from Alice to your address

1. Copy the H160 account address from Metamask (Example: 0x801A66C22156Bff1B78446A1273b7109E71d7548)
2. Paste it into `recipientEthereumAddress` in main function in transfer.js scripts
3. Execute:

```bash
yarn install
node transfer.js
```

## Balance transfer from EVM address back to Substrate balances - method 1: Using evm::withdraw

1. Copy your ss58 address (Example: 5H3qhPGzKMNV9fTPuizxzp8azyFRMd4BnheSuwN9Qxb5Cz3u). You need to have the private key for this address setup in Polkadot JS extension.
2. Paste it into `ss58Address` in main function in withdraw-address.js script 
3. Execute:

```bash
node withdraw-address.js
```

4. Copy the "Ethereum mirror:" output address
5. Transfer the amount to this address that you wish to transfer using Metamask (make sure to clear activity tab data if you restarted the network previously: Settings - Advanced - Clear activity tab data)
6. Make sure your destination address is funded to run a transaction
7. Open Extrisics tab in Apps UI: https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9946#/extrinsics
8. Select `evm` pallet and `withdraw` extrinsic 
9. Paste the "Ethereum mirror" output address into address field
10. Put the amount you are transferring into amount field. Note that Metamask balances are by 10^9 lower than Polkadot Apps UI balances because Metamask will not respect 10^9 decimals for native currency before we have a corresponding PR to https://github.com/ethereum-lists merged.
11. Submit transaction

## Balance transfer from EVM address back to Substrate balances - method 2: Using a SubtensorBalanceTransfer precompile

1. Copy destination ss58 address (Example: 5H3qhPGzKMNV9fTPuizxzp8azyFRMd4BnheSuwN9Qxb5Cz3u)
2. Paste it into `const destinationAddress` on top of withdraw.js script 
3. Copy `secrets-example.js` file to `secrets.js`
4. Replace `const ethPrivateKey` value with your Ethereum address private key (you can export it from Metamask in account details).
5. Run:

```bash
node withdraw.js
```

