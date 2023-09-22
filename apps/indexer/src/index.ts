import { config } from "dotenv";
import { ethers } from "ethers";

import CurveABI from "./abi/Curved.json" assert { type: "json" };
import { DB } from "./DB";

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
const db = new DB();

curve.on("*", async (event) => {
  switch (event.event) {
    case "ShareCreated": {
      const owner = event.args[0];
      const shareId = event.args[1].toNumber();

      try {
        const pending: any = await db.fetchOne(
          "pending_content",
          `owner="${owner}"`,
        );

        if (!pending) {
          console.log("No pending content found");
          return;
        }

        console.log(
          `Inserting ${owner} and ${shareId} into content table`,
          pending,
        );

        await db.insert("content", {
          description: pending.description,
          owner: pending.owner,
          share_id: shareId,
          url: pending.url,
        });

        await db.delete("pending_content", `owner="${owner}"`);
      } catch (e) {
        console.log("Error fetching pending content", e);
        // TODO: Add share + uri to content table
      }

      break;
    }
  }

  // if (event.event === "ShareCreated") {
  //   console.log("Share created");
  //   const owner = event.args[0];
  //   const shareId = event.args[1].toNumber();
  //   const entry = {
  //     amount: 1,
  //     owner: owner.toLowerCase(),
  //     price: "0",
  //     shareId,
  //     side: 0,
  //     supply: 1,
  //     trader: owner.toLowerCase(),
  //   };
  //   console.log(`Inserting ${owner} and ${shareId} into content table`);
  //   db.insert("trades", entry);
  // } else if (event.event === "Trade") {
  //   console.log("Trade event");
  //   const entry = {
  //     amount: event.args[4].toNumber(),
  //     owner: event.args[3].toLowerCase(),
  //     price: event.args[5].toString(),
  //     shareId: event.args[0].toNumber(),
  //     side: event.args[1].toNumber(),
  //     supply: event.args[6].toNumber(),
  //     trader: event.args[2].toLowerCase(),
  //   };
  //   db.insert("trades", entry);
  // } else {
  //   console.log("Unhandled event: ", event);
  // }
});
