const { ethers } = require('ethers');
const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { convertH160ToSS58 } = require('./address-mapping.js');

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, subSeed, rpcUrl, wsUrl } = require('./config.js');

async function main() {
  // Get ethereum address that matches the private key from the secrets file
  // const recipientEthereumAddress = "put your destination address here";
  // const recipientEthereumAddress = "0x709615c655B24919F48B365D292521EFcC74467B";
  const recipientEthereumAddress = "0xd685a847471F7f07Ce36f89F99C198B098B13817";
  const ss58Address = convertH160ToSS58(recipientEthereumAddress);
  console.log(`For your Ethereum H160 address: ${recipientEthereumAddress}, the SS58 address is: ${ss58Address}`);
  process.exit(0);
}

main().catch(console.error);
console.warn = () => {};
