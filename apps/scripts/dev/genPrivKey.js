import { ethers } from "ethers";

// generate private key and log it

const wallet = ethers.Wallet.createRandom();
const privateKey = wallet.privateKey;
console.log("private key: ", privateKey);
