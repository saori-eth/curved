import { pendingPost, post, trade } from "db";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { ethers } from "ethers";

import CurveABI from "./abi/Curved.json" assert { type: "json" };
import { db } from "./DB";

config();

console.log("Starting listener", {
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  WS_URL: process.env.WS_URL,
});

const provider = new ethers.providers.WebSocketProvider(
  process.env.WS_URL ?? "",
);
const curve = new ethers.Contract(
  process.env.CONTRACT_ADDRESS ?? "",
  CurveABI.abi,
  provider,
);

curve.on("*", async (event) => {
  console.log("Event", event.event);

  switch (event.event) {
    case "ShareCreated": {
      const owner = event.args[0];
      const shareId = event.args[1].toNumber();

      try {
        const pending = await db.query.pendingPost.findFirst({
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

        await db.insert(post).values({
          caption: pending.caption,
          owner: owner.toLowerCase(),
          shareId,
          url: pending.url,
        });

        // TODO: Delete pending content
        console.log("Deleting pending content");

        await db.delete(pendingPost).where(eq(pendingPost.owner, owner));

        const tradeEntry = {
          amount: 1,
          hash: event.transactionHash,
          owner: owner.toLowerCase(),
          price: 0,
          shareId: shareId,
          side: 0,
          supply: 1,
          trader: owner.toLowerCase(),
        };

        console.log("Inserting trade", tradeEntry);

        await db.insert(trade).values(tradeEntry);
      } catch (e) {
        console.error(e);
      }

      break;
    }
    case "Trade": {
      const entry = {
        amount: event.args[4].toNumber(),
        hash: event.transactionHash,
        owner: event.args[3].toLowerCase(),
        price: event.args[5].toString(),
        shareId: event.args[0].toNumber(),
        side: event.args[1].toNumber(),
        supply: event.args[6].toNumber(),
        trader: event.args[2].toLowerCase(),
      };

      console.log("Inserting trade", entry);
      await db.insert(trade).values(entry);
    }
  }
});
