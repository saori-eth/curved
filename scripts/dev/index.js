import dotenv from "dotenv";
dotenv.config();
const { LOCAL_FARM_ADDRESS, LOCAL_PRIVATE_KEY } = process.env;
import { ethers } from "ethers";
import { FARM_ABI } from "../abi/farm.js";
import assert from "assert";
import { getReason } from "../utils.js";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const wallet = new ethers.Wallet(LOCAL_PRIVATE_KEY, provider);
const farm = new ethers.Contract(LOCAL_FARM_ADDRESS, FARM_ABI, wallet);

const setup = async () => {
  // Ensure that the owner is the wallet address
  const owner = await farm.owner();
  const walletAddress = wallet.address;
  assert.equal(owner, walletAddress, "Owner is not the wallet address");
};

const testCreateShares = async () => {
  try {
    const tx = await farm.createShares(wallet.address, 1, {
      value: ethers.utils.parseEther("0"),
    });
    await tx.wait();
    console.log("Shares created");
  } catch (e) {
    console.log(getReason(e.message));
    process.exit(1);
  }
};

(async () => {
  await setup();
  await testCreateShares();
})();
