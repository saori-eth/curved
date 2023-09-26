import { config } from "dotenv";
import { ethers } from "ethers";

import CurveABI from "./abi/Curved.json" assert { type: "json" };
import { db } from "./db";
import { eq } from "drizzle-orm";
import { content, pendingContent, trades } from "./schema";

config();
const { MODE, ALCHEMY_WS, GOERLI_WS, GOERLI_CURVED_ADDRESS } = process.env;

const wsUrl = MODE === "dev" ? GOERLI_WS : ALCHEMY_WS;
const curveAddr = MODE === "dev" ? GOERLI_CURVED_ADDRESS : "";

if (!wsUrl) {
  throw new Error("Websocket URL not found");
}

if (!curveAddr) {
  throw new Error("Curve address not found");
}

const provider = new ethers.providers.WebSocketProvider(wsUrl);
const curve = new ethers.Contract(curveAddr, CurveABI.abi, provider);

console.log("STARTING INDEXER", { curveAddr, wsUrl });

curve.on("*", async (event) => {
  console.log("Event", event.event);

  switch (event.event) {
    case "ShareCreated": {
      const owner = event.args[0];
      const shareId = event.args[1].toNumber();

      try {
        const pending = await db.query.pendingContent.findFirst({
          where: (row, { eq }) => eq(row.owner, owner),
        });

        if (!pending) {
          console.log("No pending content found. Ignoring onchain event.");
          // TODO: Add share + uri to content table
          return;
        }

        console.log(
          `Inserting ${owner} and ${shareId} into content table`,
          pending,
        );

        await db.insert(content).values({
          owner: owner as string,
          shareId,
          url: pending.url,
          description: pending.description,
        });

        // TODO: Delete pending content
        console.log("Deleting pending content");

        await db.delete(pendingContent).where(eq(pendingContent.owner, owner));

        const tradeEntry = {
          shareId: shareId,
          side: 0,
          trader: owner.toLowerCase(),
          owner: owner.toLowerCase(),
          amount: 1,
          price: 0,
          supply: 1,
          hash: event.transactionHash,
        };

        console.log("Inserting trade", tradeEntry);

        await db.insert(trades).values(tradeEntry);
      } catch (e) {
        console.error(e);
      }

      break;
    }
    case "Trade": {
      const entry = {
        shareId: event.args[0].toNumber(),
        side: event.args[1].toNumber(),
        trader: event.args[2].toLowerCase(),
        owner: event.args[3].toLowerCase(),
        amount: event.args[4].toNumber(),
        price: event.args[5].toString(),
        supply: event.args[6].toNumber(),
        hash: event.transactionHash,
      };

      console.log("Inserting trade", entry);
      await db.insert(trades).values(entry);
    }
  }
});
