# Hardhat Configuration for Subtensor EVM

The HardHat networks can be configures as follows. The code below configures two networks: 

1. Local network with URL: http://127.0.0.1:9946
2. EVM Testnet network with URL: https://evm-testnet.dev.opentensor.ai

```js
const hardhatConfig: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "subevm",
  networks: {
    subevm: {
      url: "https://evm-testnet.dev.opentensor.ai",
      accounts: [config.ethPrivateKey]
    },
    local: {
      url: "http://127.0.0.1:9946",
      accounts: [config.ethPrivateKey]
    }
  },
  mocha: {
    timeout: 300000
  },
};
```

See [ERC-20 Example Token repository](https://github.com/gztensor/subtensor-erc20) for complete example.