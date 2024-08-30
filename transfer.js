const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { convertH160ToSS58 } = require('./address-mapping.js');

function sendTransaction(api, call, signer) {
    return new Promise((resolve, reject) => {
      let unsubscribed = false;
  
      const unsubscribe = call.signAndSend(signer, ({ status, events, dispatchError }) => {
        const safelyUnsubscribe = () => {
          if (!unsubscribed) {
            unsubscribed = true;
            unsubscribe.then(() => {})
              .catch(error => console.error('Failed to unsubscribe:', error));
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
      }).catch((error) => {
        reject(error);
      });
    });
}

async function main() {
    const wsProvider = new WsProvider('ws://127.0.0.1:9946');
    const api = await ApiPromise.create({ provider: wsProvider });
    const keyring = new Keyring({ type: 'sr25519' });

    const sender = keyring.addFromUri('//Alice'); // Your sender's private key/seed
    // Ethereum address that matches the private key from the example secrets: 
    // 0000000000000000000000000000000000000000000000000000000000000001
    const recipientEthereumAddress = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf'; 

    const ss58Address = convertH160ToSS58(recipientEthereumAddress);
    // Amount to send. Using gazillion for now until we have a merged PR into ethereumlists so that Metamask
    // respects our 9 decimals
    const amount = "1000000000000000000";

    // Alice funds herself
    const txSudoSetBalance = api.tx.sudo.sudo(
        api.tx.balances.forceSetBalance(sender.address, "10000000000000000000")
    );
    await sendTransaction(api, txSudoSetBalance, sender);
    console.log('Balace force-set');

    // Create a transfer transaction
    const transfer = api.tx.balances.transferKeepAlive(ss58Address, amount);

    // Sign and send the transaction
    await sendTransaction(api, transfer, sender);
    console.log(`Transfer sent (mirror address: ${ss58Address})`);
    await api.disconnect();
}

main().catch(console.error);


// curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x801A66C22156Bff1B78446A1273b7109E71d7548", "latest"],"id":1}' http://localhost:9946
// curl -H "Content-type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest", false],"id":1}' http://localhost:9946
