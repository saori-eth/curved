import { config } from "dotenv";
import { ethers } from "ethers";

import CurveABI from "./abi/Curved.json" assert { type: "json" };
import { db } from "./db";
import { eq } from "drizzle-orm";
import { content, pendingContent } from "./schema";

config();
const { MODE, ALCHEMY_WS, LOCAL_WS, LOCAL_CURVED_ADDRESS } = process.env;

const wsUrl = MODE === "dev" ? LOCAL_WS : ALCHEMY_WS;
const curveAddr = MODE === "dev" ? LOCAL_CURVED_ADDRESS : "";

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
      } catch (e) {
        console.error(e);
      }

      break;
    }
  }
});
