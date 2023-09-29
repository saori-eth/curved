import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();
import { CURVED_ABI } from "../abi/CurvedAbi.js";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const wallet = new ethers.Wallet(process.env.LOCAL_PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.LOCAL_CURVED_ADDRESS,
  CURVED_ABI,
  wallet,
);

const initRewards = async () => {
  // const tx = await contract.createShare("ipfs://uri");
  // await tx.wait();
  const cost = await contract.getBuyPriceAfterFee(0, 15);
  const tx2 = await contract.buyShare(0, 15, {
    value: cost,
  });
  await tx2.wait();
  console.log("Rewards initialized", tx2);
};

initRewards();
