const { blake2AsU8a } = require('@polkadot/util-crypto');
const { hexToU8a } = require('@polkadot/util');
const { encodeAddress } = require('@polkadot/util-crypto');

/**
 * Converts an Ethereum H160 address to a Substrate SS58 address public key.
 * @param {string} ethAddress - The H160 Ethereum address as a hex string.
 * @return {string} The bytes array containing the Substrate public key.
 */
function convertH160ToSS58(ethAddress) {
    const prefix = 'evm:';
    const prefixBytes = new TextEncoder().encode(prefix);
    const addressBytes = hexToU8a(ethAddress.startsWith('0x') ? ethAddress : `0x${ethAddress}`);
    const combined = new Uint8Array(prefixBytes.length + addressBytes.length);

    // Concatenate prefix and Ethereum address
    combined.set(prefixBytes);
    combined.set(addressBytes, prefixBytes.length);

    // Hash the combined data (the public key)
    const hash = blake2AsU8a(combined);

    // Convert the hash to SS58 format
    const ss58Address = encodeAddress(hash, 42); // Assuming network ID 42, change as per your network
    return ss58Address;
}

module.exports = {
    convertH160ToSS58
}