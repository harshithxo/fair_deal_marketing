// server/src/services/aptos.js
require("dotenv").config();
const { AptosClient, AptosAccount, HexString } = require("aptos");

const NODE_URL = process.env.APTOS_NODE;
const client = new AptosClient(NODE_URL);

const SERVER_ACCOUNT = AptosAccount.fromAptosAccountObject({
  privateKeyHex: process.env.PRIVATE_KEY,
});

const MODULE_OWNER = process.env.MODULE_OWNER;

async function buyProduct(ownerAddress, productId, price, buyerAddress) {
  try {
    if (!MODULE_OWNER) throw new Error("MODULE_OWNER not set");

    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_OWNER}::FairSell::buy`,
      type_arguments: [],
      arguments: [
        buyerAddress || SERVER_ACCOUNT.address().hex(),
        ownerAddress,
        productId.toString(),
        price.toString(),
      ],
    };

    const txnRequest = await client.generateTransaction(SERVER_ACCOUNT.address(), payload);
    const signedTxn = await client.signTransaction(SERVER_ACCOUNT, txnRequest);
    const res = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(res.hash);

    return res.hash;
  } catch (err) {
    console.error("❌ Blockchain purchase failed:", err.message || err);
    throw err;
  }
}

module.exports = { buyProduct };
