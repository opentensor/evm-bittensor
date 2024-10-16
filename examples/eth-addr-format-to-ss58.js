const { ethers } = require('ethers');
const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { convertH160ToSS58 } = require('./address-mapping.js');

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, subSeed, rpcUrl, wsUrl } = require('./config.js');

async function main() {
  // Paste your Metamask wallet account address (Ethereum H160 address) into recipientEthereumAddress. For example:
  // const recipientEthereumAddress = "0x709615c655B24919F48B365D292521EFcC74467B";
  // Run "yarn install" followed by "node eth-addr-format-to-ss58.js".
  // The script will display the output, for example: "The SS58 address of your Ethereum H160 address is: 5HMd2QQ2XKaQ5gF5wQvKautTvTU21bDMFWVhv2YJ84SQMi6Z"
  const recipientEthereumAddress = "0x709615c655B24919F48B365D292521EFcC74467B";
  const ss58Address = convertH160ToSS58(recipientEthereumAddress);
  console.log(`For your Ethereum H160 address: ${recipientEthereumAddress}, the SS58 address is: ${ss58Address}`);
  process.exit(0);
}

main().catch(console.error);
console.warn = () => {};
