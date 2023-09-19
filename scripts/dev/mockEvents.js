import dotenv from "dotenv";
dotenv.config();
const { LOCAL_CURVED_ADDRESS, LOCAL_PRIVATE_KEY } = process.env;
import { ethers } from "ethers";
import { CURVED_ABI } from "../abi/CurvedAbi.js";
import assert from "assert";
import { getReason } from "../utils.js";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const wallet = new ethers.Wallet(LOCAL_PRIVATE_KEY, provider);
const curved = new ethers.Contract(LOCAL_CURVED_ADDRESS, CURVED_ABI, wallet);

const setup = async () => {
  // Insure that the owner is the wallet address
  const owner = await curved.owner();
  const walletAddress = wallet.address;
  assert.equal(owner, walletAddress, "Owner is not the wallet address");
  const balance = await provider.getBalance(walletAddress);
  console.log("Balance: ", ethers.utils.formatEther(balance));
};

const testCreateShares = async () => {
  try {
    const tx = await curved.createShare("ipfs://test");
    await tx.wait();
    console.log("Shares created");
  } catch (e) {
    console.log(e.message);
    console.log("reason: ", getReason(e.message));
    process.exit(1);
  }
};

const testPurchaseShares = async () => {
  try {
    const cost = await curved.getBuyPriceAfterFee(0, 1);
    const tx = await curved.buyShare(0, 1, { value: cost });
    await tx.wait();
    console.log("Shares purchased");
  } catch (e) {
    console.log(e.message);
    console.log("reason: ", getReason(e.message));
    process.exit(1);
  }
};

(async () => {
  await setup();
  await testCreateShares();
  await testPurchaseShares();
})();
