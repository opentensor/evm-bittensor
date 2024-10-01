# Ed25519 Verify Precompile

This precompile is deployed at address `0x0000000000000000000000000000000000000402` and allows to verify an ed25519 signature. This can useful for verifying proof of ss58 account ownership on EVM side. One of the use cases for such verification is an airdrop to TAO owners: While EVM functionality doesn't allow airdropping directly to ss58 addresses (because EVM is using H160 address schema), one can implement an airdrop via claiming. An owner of ss58 address eligible for an airdrop can send an EVM transaction which includes the proof of ss58 address ownership (e.g. a signed message, uniquely specific for a given airdrop).

For a complete example see [ed25519-verify.js](../ed25519-verify.js)

## Usage

To run an example, execute:
```bash
node ed25519-verify.js
```

This example demonstrates how to:

1. Sign an arbitrary message with ed25519 key (any substrate keyring can be initialized as ed25519 with the same seed phrase or private key as used for signing Subtensor transactions, even if they are usually used to create sr25519 signatures). The precompile only allows verification of 32-byte messages, nonetheless, the arbitrary message can be converted into 32-byte message by calculating the message hash (like it is done in this example):

```javascript
  const messageHash = ethers.keccak256(messageHex); // Hash the message to fit into bytes32
```

2. Verify the signature using the precompile contract
3. Fail the verification of the signature using the corrupted message hash with the precompile contract
4. Fail the verification of the corrupted signature with the precompile contract