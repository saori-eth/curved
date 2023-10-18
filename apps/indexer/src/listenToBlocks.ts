import { ethers } from "ethers";
import { Worker } from "worker_threads";

import { insertShare } from "./insertShare";
import { insertTrade } from "./insertTrade";
import { msgDiscord } from "./msgDiscord";

export function listenToBlocks(contract: ethers.Contract) {
  console.log("Spawning worker threads...");

  const userWorker = new Worker(
    new URL("./workers/user_accounting.js", import.meta.url),
  );

  userWorker.on("exit", (code) => {
    console.log(`User worker stopped with exit code ${code}`);
    process.exit(1);
  });

  const shareWorker = new Worker(
    new URL("./workers/share_accounting.js", import.meta.url),
  );

  shareWorker.on("exit", (code) => {
    console.log(`Share worker stopped with exit code ${code}`);
    process.exit(1);
  });

  console.log("Listening to new blocks...");

  contract.on("*", async (event) => {
    console.log(`New ${event.event} event`);

    const workerEvent = {
      address: event.address,
      args: event.args.map((arg: any) => {
        return arg._isBigNumber ? arg.toString() : arg;
      }),
      blockHash: event.blockHash,
      blockNumber: event.blockNumber,
      data: event.data,
      event: event.event,
      eventSignature: event.eventSignature,
      logIndex: event.logIndex,
      removed: event.removed,
      topics: event.topics,
      transactionHash: event.transactionHash,
      transactionIndex: event.transactionIndex,
    };

    userWorker.postMessage(workerEvent);

    switch (event.event) {
      case "ShareCreated": {
        try {
          await insertShare(event);
        } catch (e) {
          console.log("Error inserting share", e);
          msgDiscord("Error inserting share");
        }

        break;
      }
      case "Trade": {
        try {
          await insertTrade(event);
        } catch (e) {
          console.log("Error inserting trade", e);
          msgDiscord("Error inserting trade");
        }

        shareWorker.postMessage(workerEvent);
        break;
      }
    }
  });
}
