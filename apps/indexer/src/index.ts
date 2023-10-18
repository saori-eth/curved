import { ethers } from "ethers";

import SharesABI from "./abi/Shares.json" assert { type: "json" };
import { indexHistoricalBlocks } from "./indexHistoricalBlocks";
import { listenToBlocks } from "./listenToBlocks";
import { msgDiscord } from "./msgDiscord";

if (!process.env.WS_URL) {
  throw new Error("WS_URL env variable must be set");
}

if (!process.env.SHARES_ADDRESS) {
  throw new Error("SHARES_ADDRESS env variable must be set");
}

const provider = new ethers.providers.WebSocketProvider(process.env.WS_URL);
const contract = new ethers.Contract(
  process.env.SHARES_ADDRESS,
  SharesABI.abi,
  provider,
);

try {
  await indexHistoricalBlocks(provider, contract);
  listenToBlocks(contract);
} catch (e) {
  console.error("Error indexing historical blocks", e);
  msgDiscord("Error indexing historical blocks").finally(() => {
    process.exit(1);
  });
}
