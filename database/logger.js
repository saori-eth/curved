const dotenv = require("dotenv");
dotenv.config();
const { ethers } = require("ethers");
const CurveABI = require("./abi/Curved.json");
const { MODE, ALCHEMY_WS, LOCAL_WS, LOCAL_CURVE_ADDRESS } = process.env;

const wsUrl = MODE === "dev" ? LOCAL_WS : ALCHEMY_WS;
const curveAddr = MODE === "dev" ? LOCAL_CURVE_ADDRESS : "";
const provider = new ethers.providers.WebSocketProvider(wsUrl);
const curve = new ethers.Contract(curveAddr, CurveABI, provider);

curve.on("*", (event) => {
  console.log(event);
});
