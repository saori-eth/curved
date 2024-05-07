import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();
import tokenABI from "./contracts/out/Token.sol/Yuyu.json" assert { type: "json" };
import sharesAbi from "./contracts/out/Curved.sol/Curved.json" assert { type: "json" };
import vestingAbi from "./contracts/out/Vesting.sol/Vesting.json" assert { type: "json" };

const tAbi = tokenABI.abi;
const sAbi = sharesAbi.abi;
const vAbi = vestingAbi.abi;
const tBytecode = tokenABI.bytecode;
const sBytecode = sharesAbi.bytecode;
const vBytecode = vestingAbi.bytecode;

const { GOERLI_HTTP, GOERLI_PK, BASE_HTTP, BASE_PK, BASE_DEV_PK } = process.env;
// const GOERLI_HTTP = "http://localhost:8545";
// const GOERLI_PK =
//   "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// const provider = new ethers.providers.JsonRpcProvider(GOERLI_HTTP);
// const wallet = new ethers.Wallet(GOERLI_PK, provider);
const provider = new ethers.providers.JsonRpcProvider(BASE_HTTP);
const wallet = new ethers.Wallet(BASE_DEV_PK, provider);

const deployToken = async () => {
  const factory = new ethers.ContractFactory(tAbi, tBytecode, wallet);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log("Token deployed to:", contract.address);
  return contract;
};

const deployVestingWallet = async (token) => {
  const factory = new ethers.ContractFactory(vAbi, vBytecode, wallet);
  const thirteenWeeks = 13 * 7 * 24 * 60 * 60;
  const fiftyTwoWeeks = 52 * 7 * 24 * 60 * 60;
  const sixYears = fiftyTwoWeeks * 6;
  const block = await provider.getBlock();
  const currentTimestamp = block.timestamp;
  const startTimestamp = currentTimestamp + thirteenWeeks;
  const constructor = {
    beneficiary: wallet.address,
    // 13 week cliff
    startTimestamp: startTimestamp.toString(),
    // 52 week * 6 duration
    durationSeconds: sixYears.toString(),
  };
  console.log(constructor);
  const contract = await factory.deploy(
    constructor.beneficiary,
    constructor.startTimestamp,
    constructor.durationSeconds,
  );
  await contract.deployed();
  console.log("Vesting deployed to:", contract.address);
  console.log("Sending tokens to vesting contract");
  const amount = ethers.utils.parseEther("2000000000");
  const tx = await token.transfer(contract.address, amount);
  await tx.wait();
  console.log("Tokens sent to vesting contract");
  return contract;
};

const deployShares = async (tokenAddr) => {
  const factory = new ethers.ContractFactory(sAbi, sBytecode, wallet);
  const contract = await factory.deploy(tokenAddr);
  await contract.deployed();
  console.log("Shares deployed to:", contract.address);
  return contract;
};

const initMinter = async (sharesAddress, token) => {
  const tx = await token.addMinter(sharesAddress);
  await tx.wait();
  console.log("Minter added to token");
};

const main = async () => {
  const token = await deployToken();
  const tokenAddress = token.address;
  await deployVestingWallet(token);
  const shares = await deployShares(tokenAddress);
  const sharesAddress = shares.address;
  await initMinter(sharesAddress, token);
};

main();
