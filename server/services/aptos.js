require("dotenv").config();
const { AptosClient, AptosAccount, HexString } = require("aptos");

const NODE_URL = process.env.APTOS_NODE;
if (!NODE_URL) throw new Error("APTOS_NODE missing in .env");

const client = new AptosClient(NODE_URL);

// Server account (can be middleman or admin account)
const SERVER_ACCOUNT = AptosAccount.fromAptosAccountObject({
  privateKeyHex: process.env.PRIVATE_KEY,
});
if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY missing in .env");

const MODULE_OWNER = process.env.MODULE_OWNER;
if (!MODULE_OWNER) throw new Error("MODULE_OWNER missing in .env");

/**
 * Add a product to blockchain
 * @param {Object} params
 * @param {string} params.middlemanAddress
 * @param {string} params.manufacturerAddress
 * @param {number} params.price
 * @param {number} params.mfg_bps
 * @param {number} params.mm_bps
 * @param {string} params.meta
 */
async function addProductBlockchain({
  middlemanAddress,
  manufacturerAddress,
  price,
  mfg_bps,
  mm_bps,
  meta,
}) {
  try {
    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_OWNER}::FairSell::add_product`,
      type_arguments: [],
      arguments: [
        middlemanAddress,
        manufacturerAddress,
        price.toString(),
        mfg_bps,
        mm_bps,
        meta,
      ],
    };

    const txnRequest = await client.generateTransaction(
      SERVER_ACCOUNT.address(),
      payload
    );
    const signedTxn = await client.signTransaction(SERVER_ACCOUNT, txnRequest);
    const res = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(res.hash);

    return res.hash;
  } catch (err) {
    console.error("❌ Blockchain add product failed:", err.message || err);
    throw err;
  }
}

/**
 * Buy a product from blockchain
 * @param {string|number} productId
 * @param {number} price
 * @param {string} buyerAddress
 */
async function buyProduct(productId, price, buyerAddress) {
  try {
    if (!buyerAddress) buyerAddress = SERVER_ACCOUNT.address().toHex(); // fallback

    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_OWNER}::FairSell::buy`,
      type_arguments: [],
      arguments: [
        buyerAddress,
        MODULE_OWNER,
        productId.toString(),
        price.toString(),
      ],
    };

    const txnRequest = await client.generateTransaction(
      SERVER_ACCOUNT.address(),
      payload
    );
    const signedTxn = await client.signTransaction(SERVER_ACCOUNT, txnRequest);
    const res = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(res.hash);

    return res.hash;
  } catch (err) {
    console.error("❌ Blockchain purchase failed:", err.message || err);
    throw err;
  }
}

module.exports = {
  addProductBlockchain,
  buyProduct,
};
