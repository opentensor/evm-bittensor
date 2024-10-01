const { ethers } = require('ethers');
const { Keyring } = require('@polkadot/keyring');

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { rpcUrl } = require('./config.js');

const provider = new ethers.JsonRpcProvider(rpcUrl);

const IED25519VERIFY_ADDRESS = '0x0000000000000000000000000000000000000402';
const IEd25519VerifyABI = [
    {
        "inputs": [
            { "internalType": "bytes32", "name": "message", "type": "bytes32" },
            { "internalType": "bytes32", "name": "publicKey", "type": "bytes32" },
            { "internalType": "bytes32", "name": "r", "type": "bytes32" },
            { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "name": "verify",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "pure",
        "type": "function"
    }
];

async function main() {
  const keyring = new Keyring({ type: 'ed25519' });
  const myAccount = keyring.addFromUri('//Alice');

  //////////////////////////////////////////////////////////////////////
  // Generate a signature

  // Your message to sign
  const message = 'Sign this message';
  const messageU8a = new TextEncoder().encode(message);
  const messageHex = ethers.hexlify(messageU8a); // Convert message to hex string
  const messageHash = ethers.keccak256(messageHex); // Hash the message to fit into bytes32
  console.log(`messageHash = ${messageHash}`);
  const hashedMessageBytes = hexToBytes(messageHash);

  // Sign the message
  const signature = myAccount.sign(hashedMessageBytes);
  console.log(`Signature: ${bytesToHex(signature)}`);

  // Verify the signature locally
  const isValid = myAccount.verify(hashedMessageBytes, signature, myAccount.publicKey);
  console.log(`Is the signature valid? ${isValid}`);

  //////////////////////////////////////////////////////////////////////
  // Verify the signature using the precompile contract

  const publicKeyBytes = bytesToHex(myAccount.publicKey);
  console.log(`publicKeyBytes = ${publicKeyBytes}`);

  // Split signture into Commitment (R) and response (s)
  let r = signature.slice(0, 32); // Commitment, a.k.a. "r" - first 32 bytes
  let s = signature.slice(32, 64); // Response, a.k.a. "s" - second 32 bytes
  let rBytes = bytesToHex(r);
  let sBytes = bytesToHex(s);
  const ed25519Contract = new ethers.Contract(IED25519VERIFY_ADDRESS, IEd25519VerifyABI, provider);
  const isPrecompileValid = await ed25519Contract.verify(messageHash, publicKeyBytes, rBytes, sBytes);
  console.log(`Is the signature valid according to the smart contract? ${isPrecompileValid}`);

  //////////////////////////////////////////////////////////////////////
  // Verify the signature for bad data using the precompile contract

  let brokenHashedMessageBytes = hashedMessageBytes;
  brokenHashedMessageBytes[0] = (brokenHashedMessageBytes[0] + 1) % 0xff;
  const brokenMessageHash = bytesToHex(brokenHashedMessageBytes);
  console.log(`brokenMessageHash = ${brokenMessageHash}`);
  const isPrecompileValidBadData = await ed25519Contract.verify(brokenMessageHash, publicKeyBytes, rBytes, sBytes);
  console.log(`Is the signature valid according to the smart contract for broken data? ${isPrecompileValidBadData}`);

  //////////////////////////////////////////////////////////////////////
  // Verify the bad signature for good data using the precompile contract

  let brokenR = r;
  brokenR[0] = (brokenR[0] + 1) % 0xff;
  rBytes = bytesToHex(r);
  const isPrecompileValidBadSignature = await ed25519Contract.verify(messageHash, publicKeyBytes, rBytes, sBytes);
  console.log(`Is the signature valid according to the smart contract for broken signature? ${isPrecompileValidBadSignature}`);
}

main().catch(console.error);

function hexToBytes(hex) {
  // Remove the '0x' prefix if it exists
  if (hex.startsWith('0x')) {
      hex = hex.slice(2);
  }

  // Initialize the array
  var bytes = new Uint8Array(hex.length / 2);

  // Loop through each pair of characters
  for (var i = 0; i < bytes.length; i++) {
      // Convert the pair of characters to a byte
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }

  return bytes;
}

function bytesToHex(bytes) {
  // Initialize the hex string
  var hex = [];

  // Loop through each byte
  for (var i = 0; i < bytes.length; i++) {
      // Convert each byte to a hex string and add it to the array
      // Ensure it is two digits by padding with a zero if necessary
      hex.push((bytes[i] >>> 4).toString(16));
      hex.push((bytes[i] & 0xF).toString(16));
  }

  // Join all hex string parts into one string
  return '0x' + hex.join('');
}