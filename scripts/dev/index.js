import dotenv from "dotenv";
dotenv.config();
const { LOCAL_FARM_ADDRESS, LOCAL_PRIVATE_KEY } = process.env;
import { ethers } from "ethers";
import { FARM_ABI } from "../abi/farm.js";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const wallet = new ethers.Wallet(LOCAL_PRIVATE_KEY, provider);
const farm = new ethers.Contract(LOCAL_FARM_ADDRESS, FARM_ABI, wallet);

const setup = async () => {
  const owner = await farm.owner();
  console.log("owner", owner);
};

(async () => {
  await setup();
})();
