import dotenv from "dotenv";
dotenv.config();
import { ethers } from "ethers";
import { DB } from "./DB.js";
import CurveABI from "./abi/Curved.json";
const { MODE, ALCHEMY_WS, LOCAL_WS, LOCAL_CURVED_ADDRESS } = process.env;

const wsUrl = MODE === "dev" ? LOCAL_WS : ALCHEMY_WS;
const curveAddr = MODE === "dev" ? LOCAL_CURVED_ADDRESS : "";
const provider = new ethers.providers.WebSocketProvider(wsUrl);
const curve = new ethers.Contract(curveAddr, CurveABI, provider);
const db = new DB();

curve.on("*", (event) => {
  if (event.event === "ShareCreated") {
    console.log("Share created");
    const owner = event.args[0];
    const shareId = event.args[1].toNumber();
    const entry = {
      shareId,
      side: 0,
      trader: owner.toLowerCase(),
      owner: owner.toLowerCase(),
      amount: 1,
      price: "0",
      supply: 1,
    };
    console.log(`Inserting ${owner} and ${shareId} into content table`);
    db.insert("trades", entry);
  } else if (event.event === "Trade") {
    console.log("Trade event");
    const entry = {
      shareId: event.args[0].toNumber(),
      side: event.args[1].toNumber(),
      trader: event.args[2].toLowerCase(),
      owner: event.args[3].toLowerCase(),
      amount: event.args[4].toNumber(),
      price: event.args[5].toString(),
      supply: event.args[6].toNumber(),
    };
    db.insert("trades", entry);
  } else {
    console.log("Unhandled event: ", event);
  }
});
