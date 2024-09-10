# Subtensor EVM Integration Kit


## Setting up network

The developer setup can be done in two ways. It includes settings up network URLs, account private keys, and initial balances needed for this guide (and further development).

1. [Using EVM Subtensor TestNet](docs/running-on-testnet.md)
2. [Local setup](docs/running-locally.md) (requires Rust and tools to be installed)

[Testnet Faucet](https://evm-testnet.dev.opentensor.ai/faucet)

## Balance transfer from Substrate (ss58) to EVM (H160) address

This step is not required if you're working with Subtensor Testnet. It is only essential for starting development with local setup because it transfers some initial TAO balance from the Substrate side to EVM side.

Execute:

```bash
yarn install
node transfer.js
```

## Balance transfer from EVM address back to Substrate balances - method 1: Using evm::withdraw

1. Copy your ss58 address (Example: 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty). You need to have the private key for this address setup in Polkadot JS extension.
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

This step will transfer 1 TAO to your ss58 address configured with seed phrase in config.js as `subSeed`.

Execute:

```bash
node withdraw.js
```

Nonetheless, the destination address can be changed to any ss58 address (the private key/seed is not required for it in this step). Look for these lines in `withdraw.js` file:

```javascript
// Destination address can be replaced with any ss58 address here:
const destinationAddress = account.address;
// const destinationAddress = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";
```

## Further examples

- [Hardhat configuration](docs/hardhat-config.md)
- [Plain vanilla balance transfer (in JS)](docs/plain-vanilla-balance-transfer.md)
- [Deploying and interacting with ERC-20 token](https://github.com/gztensor/subtensor-erc20)
- [Interaction with staking precompile](docs/staking-precompile.md)

