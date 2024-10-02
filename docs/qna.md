# Subtensor EVM Q&A

This upgrade expands the possible ways to interact with the Bittensor network, making it possible for users to be able to use EVM-focused applications like MetaMask and Trust Wallet (among many others) as well as ones specific to substrate.  It does not change the core mission of Bittensor, which is to supercharge the development of first-class AI models through incentivized competition.  The intent is not to make Bittensor a general-purpose blockchain, but rather to allow options to use EVM tools to accomplish what is only possible with substrate right now.

## Is Subtensor EVM different from any other EVM chains?

The EVM side of Subtensor is built with Frontier and EVM pallets. It has most of the EVM functionality in place, but some new EIPs that are recently deployed to Ethereum network may be yet be available.

## How can smart contracts or EVM-based dApps interact with Subtensor?

The initial release will provide a few precompile contracts that allow such interaction:

1. Balance transfers between EVM addresses operating on the Bittensor network, and native Subtensor addresses.

This is not a transfer of non-native TAO tokens on an EVM network to native TAO tokens on the Bittensor network. This is a transfer of native TAO tokens from an EVM-style account that's interacting with the Bittensor network (the kind that starts with `0x`) to another account on the Bittensor network (either another EVM-style account or a regular substrate account (the kind that starts with `5`).

2. Smart contracts and/or user addresses can act like coldkeys to stake and unstake to delegate hotkeys.
3. Verification of ed25519 signatures (e.g. to allow airdrop or claiming functionality).

Later we will make more features available such as:

1. Miscellaneous state variables such as stake, bonds, validator trust, etc. will be accessible from smart contracts (and via EVM RPC interface)
2. More extrinsics will be available on the EVM side as well. Examples of such may include creating subnets, registrations, settings weights, etc.

## How will a regular user interact with Subtensor EVM?

A regular user (with no engineering background) familiar with Metamask or other EVM crypto wallets will initially be able to participate in staking, as soon as web3 applications that provide a UI for such functionality become available. They will be able to nominate stake to one of the hotkeys that allow delegation. These applications will also be capable of providing DEX functionality, liquid staking, and staking pools to leverage Subtensor staking further.

Later, as more Subtensor features become available to EVM space, users will see more flexible dApps with advanced functionality.

## How to transfer balance from Substrate to Metamask address and back?

The readme in [Subtensor EVM Integration Kit](https://github.com/gztensor/evm-demo) explains how to do it programmatically.
There are no UI tools for this yet that are ready to be used by non-engineers.

## Are there any active bridges that allow transferring value between Subtensor EVM and other chains?

Not at the moment, but a few integrations are in progress.

## I am confused: Does having EVM functionality on Subtensor mean that I can transfer my Ethereum assets to it or that Ethereum smart contracts can interact with BitTensor?

Not exactly. The EVM functionality means that BitTensor mimics the programming interface provided by Ethereum or similar networks. The analogy here is Polygon and Ethereum. While Eth can be transferred to Polygon via a bridge, it does not necessarily mean that an Ethereum smart contract can call Polygon smart contract directly because they are two different networks.

Similarly, BitTensor will have its own address space, block numbers, native currency (TAO), etc. The only thing in common between Ethereum and BitTensor EVM is their programming interface.

## Why does Metamask show that I have balance <0.000001 TAO when I have 1 TAO?

Metamask treats all EVM chains as if they have 18 decimals. TAO only uses 9 decimals, this is why a balance of 1_000_000_000 RAO (1 TAO) shows in Metamask as 0.000000001.

## What is the gas price in Subtensor EVM?

10 GWei

## What are network parameters to access the Subtensor EVM network?

### Dedicated EVM Testnet

```
RPC Endpoint: https://evm-testnet.dev.opentensor.ai	
Chain ID: 945
```

### Subtensor Testnet

Currently (as of beginning of October 2024) EVM functionality is not yet available on the Testnet, but when we deploy EVM functionality to our Testnet, it will be available with the following parameters:

```
RPC Endpoint: https://test.finney.opentensor.ai
Chain ID: 946
```

## How can I deploy smart contracts on Bittensor?

## How can I mint NFTs on Bittensor?

## How can I deploy a token (ERC-20) on Bittensor?

## What are the list of ERCs that Bittensor supports (I guarantee you that they are looking for ERC-20, and some flavor of ERC-721/-1155 etc).

