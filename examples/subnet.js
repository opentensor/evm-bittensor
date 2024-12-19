const { ethers } = require("ethers");
const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
const { convertH160ToSS58 } = require("./address-mapping.js");
const { decodeAddress } = require("@polkadot/util-crypto");

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, subSeed, rpcUrl, wsUrl } = require("./config.js");
const amount1TAO = BigInt("1000000000");
// Connect to the Subtensor node
const provider = new ethers.JsonRpcProvider(rpcUrl);

function sendTransaction(api, call, signer) {
  return new Promise((resolve, reject) => {
    let unsubscribed = false;

    const unsubscribe = call
      .signAndSend(signer, ({ status, events, dispatchError }) => {
        const safelyUnsubscribe = () => {
          if (!unsubscribed) {
            unsubscribed = true;
            unsubscribe
              .then(() => {})
              .catch((error) => console.error("Failed to unsubscribe:", error));
          }
        };

        // Check for transaction errors
        if (dispatchError) {
          let errout = dispatchError.toString();
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { docs, name, section } = decoded;
            errout = `${name}: ${docs}`;
          }
          safelyUnsubscribe();
          reject(Error(errout));
        }
        // Log and resolve when the transaction is included in a block
        if (status.isInBlock) {
          safelyUnsubscribe();
          resolve(status.asInBlock);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// for set
const subnet_contract_abi = [
  {
    inputs: [
      {
        internalType: "uint16",
        name: "netuid",
        type: "uint16",
      },
      {
        internalType: "uint64",
        name: "value",
        type: "uint64",
      },
    ],
    name: "setHyperParameter",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const subnet_contract_bytecode =
  "0x6080604052348015600e575f80fd5b506101e18061001c5f395ff3fe60806040526004361061001d575f3560e01c806378b63cb614610021575b5f80fd5b61003b60048036038101906100369190610128565b61003d565b005b5f61080390508073ffffffffffffffffffffffffffffffffffffffff1663b38e0bbe84846040518363ffffffff1660e01b815260040161007e929190610184565b5f604051808303815f87803b158015610095575f80fd5b505af11580156100a7573d5f803e3d5ffd5b50505050505050565b5f80fd5b5f61ffff82169050919050565b6100ca816100b4565b81146100d4575f80fd5b50565b5f813590506100e5816100c1565b92915050565b5f67ffffffffffffffff82169050919050565b610107816100eb565b8114610111575f80fd5b50565b5f81359050610122816100fe565b92915050565b5f806040838503121561013e5761013d6100b0565b5b5f61014b858286016100d7565b925050602061015c85828601610114565b9150509250929050565b61016f816100b4565b82525050565b61017e816100eb565b82525050565b5f6040820190506101975f830185610166565b6101a46020830184610175565b939250505056fea2646970667358221220a27f0ad841abd6e9f736294eede6884e383f2d728a6645777b3d9df1653104b764736f6c634300081a0033";

// for get
// const subnet_contract_abi = [
//   {
//     inputs: [
//       {
//         internalType: "uint16",
//         name: "netuid",
//         type: "uint16",
//       },
//     ],
//     name: "getHyperParameter",
//     outputs: [
//       {
//         internalType: "uint64",
//         name: "",
//         type: "uint64",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
// ];

// const subnet_contract_bytecode =
//   "0x6080604052348015600e575f80fd5b5061023d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063786fede51461002d575b5f80fd5b61004760048036038101906100429190610124565b61005d565b6040516100549190610171565b60405180910390f35b5f8061080390505f8173ffffffffffffffffffffffffffffffffffffffff16637444dadc856040518263ffffffff1660e01b815260040161009e9190610199565b602060405180830381865afa1580156100b9573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906100dd91906101dc565b90508092505050919050565b5f80fd5b5f61ffff82169050919050565b610103816100ed565b811461010d575f80fd5b50565b5f8135905061011e816100fa565b92915050565b5f60208284031215610139576101386100e9565b5b5f61014684828501610110565b91505092915050565b5f67ffffffffffffffff82169050919050565b61016b8161014f565b82525050565b5f6020820190506101845f830184610162565b92915050565b610193816100ed565b82525050565b5f6020820190506101ac5f83018461018a565b92915050565b6101bb8161014f565b81146101c5575f80fd5b50565b5f815190506101d6816101b2565b92915050565b5f602082840312156101f1576101f06100e9565b5b5f6101fe848285016101c8565b9150509291505056fea264697066735822122000fcaf6aa4b5439ce281a7ce6ad307021f58b0ad6f6a8ee14b22bf59e9ca2bfc64736f6c634300081a0033";
//

// Create a signer
const privateKey = ethPrivateKey; // DO NOT HARDCODE YOUR PRIVATE KEY IN PRODUCTION
const signer = new ethers.Wallet(privateKey, provider);

// Function to perform the transfer
async function createSubnetCheckEmission() {
  try {
    // Substrate ss58 address that will receive the transfer
    const wsProvider = new WsProvider(wsUrl);
    const api = await ApiPromise.create({ provider: wsProvider });
    const keyring = new Keyring({ type: "sr25519" });
    const account = keyring.addFromUri(subSeed); // Your Substrate address private key/seed

    // Destination address can be replaced with any ss58 address here:
    const destinationAddress = account.address;

    // Get the substrate address public key
    const pubk = decodeAddress(destinationAddress);
    const hex = Array.from(pubk, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
    console.log(`pubk = ${hex}`);

    const signer = new ethers.Wallet(ethPrivateKey, provider);
    const ss58mirror = convertH160ToSS58(signer.address);

    const txSudoSetBalance = api.tx.sudo.sudo(
      api.tx.balances.forceSetBalance(ss58mirror, BigInt(1e16).toString())
    );
    await sendTransaction(api, txSudoSetBalance, account);

    const txSudoSetWhitelist = api.tx.sudo.sudo(
      api.tx.evm.setWhitelist([signer.address])
    );

    await sendTransaction(api, txSudoSetWhitelist, account);

    const contractFactory = new ethers.ContractFactory(
      subnet_contract_abi,
      subnet_contract_bytecode,
      signer
    );

    const subnet_contract = await contractFactory.deploy();
    await subnet_contract.waitForDeployment();

    console.log("subnet_contract deployed.", subnet_contract);

    let tx = await subnet_contract.setHyperParameter(1, 1);
    await tx.wait();

    // try get is ok.
    // const parameter = await subnet_contract.getHyperParameter(1);
    // console.log("+++++ parameter as ", parameter);

    console.log(
      "total networks is ",
      (await api.query.subtensorModule.totalNetworks()).toHuman()
    );

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(0);
  }
}

async function main() {
  await createSubnetCheckEmission();
}

main().catch(console.error);
