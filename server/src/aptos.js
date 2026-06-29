const { AptosClient, AptosAccount, HexString } = require("aptos");
require("dotenv").config();

const NODE_URL = process.env.APTOS_NODE;
const client = new AptosClient(NODE_URL);

const SERVER_ACCOUNT = AptosAccount.fromAptosAccountObject({
  privateKeyHex: process.env.PRIVATE_KEY,
});

const MODULE_OWNER = process.env.MODULE_OWNER;

// Buy product on blockchain
async function buyProduct(productId, price, buyerAddress) {
  if (!MODULE_OWNER) throw new Error("MODULE_OWNER not set");
  if (!buyerAddress) buyerAddress = SERVER_ACCOUNT.address().toHex();

  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_OWNER}::FairSell::buy`,
    type_arguments: [],
    arguments: [buyerAddress, MODULE_OWNER, productId.toString(), price.toString()],
  };

  const txnRequest = await client.generateTransaction(SERVER_ACCOUNT.address(), payload);
  const signedTxn = await client.signTransaction(SERVER_ACCOUNT, txnRequest);
  const res = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(res.hash);

  return res.hash;
}

module.exports = { buyProduct };
