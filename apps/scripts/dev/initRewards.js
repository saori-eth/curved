import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();
const { LOCAL_PRIVATE_KEY, LOCAL_CURVED_ADDRESS } = process.env;
import { CURVED_ABI } from "../abi/CurvedAbi.js";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const wallet = new ethers.Wallet(LOCAL_PRIVATE_KEY, provider);
const contract = new ethers.Contract(LOCAL_CURVED_ADDRESS, CURVED_ABI, wallet);

const initRewards = async () => {
  const tx = await contract.createShare("ipfs://uri");
  await tx.wait();
  const cost = await contract.getBuyPriceAfterFee(0, 1);
  const tx2 = await contract.buyShare(0, 1, {
    value: cost,
  });
  await tx2.wait();
  console.log("Rewards initialized", tx2);
};

initRewards();
