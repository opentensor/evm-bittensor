const { decodeAddress } = require('@polkadot/util-crypto');

/**
 * Converts an SS58 formatted Substrate address to an Ethereum-compatible address.
 * 
 * This function first decodes an SS58 address to its corresponding public key,
 * and then derives the Ethereum address by taking the first 20 bytes of this hash,
 * converting them into an H160 Ethereum address format.
 *
 * @param {string} ss58Address The SS58 formatted Substrate address to be converted.
 * @returns {string} The derived Ethereum H160 address as a hexadecimal string.
 */
function ss58ToH160(ss58Address) {
  // Decode the SS58 address to a Uint8Array public key
  const publicKey = decodeAddress(ss58Address);

  // Take the first 20 bytes of the hashed public key for the Ethereum address
  const ethereumAddressBytes = publicKey.slice(0, 20);

  // Convert the 20 bytes into an Ethereum H160 address format (Hex string)
  const ethereumAddress = '0x' + Buffer.from(ethereumAddressBytes).toString('hex');

  return ethereumAddress;
}

async function main() {
  // This is the address that we have private key for
  const ss58Address = '5H3qhPGzKMNV9fTPuizxzp8azyFRMd4BnheSuwN9Qxb5Cz3u';

  // This is the mirror address that we don't have private key for, but which will hold Eth balance
  // until the withdraw is executed
  const ethereumAddress = ss58ToH160(ss58Address);
  console.log(`Ethereum mirror: ${ethereumAddress}`);
}

main().catch(console.error);
