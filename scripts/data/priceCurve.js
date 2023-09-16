import dotenv from "dotenv";
dotenv.config();
const { PLOTLY_API_KEY } = process.env;
import Plotly from "plotly";
import { utils, BigNumber } from "ethers";

const plotly = Plotly("saori_eth", PLOTLY_API_KEY);

function getPrice(supply, amount) {
  let sum1, sum2;

  if (supply === 0) {
    sum1 = BigNumber.from(0);
  } else {
    sum1 = BigNumber.from(supply - 1)
      .mul(supply)
      .mul(2 * (supply - 1) + 1)
      .div(6);
  }

  if (supply === 0 && amount === 1) {
    sum2 = BigNumber.from(0);
  } else {
    sum2 = BigNumber.from(supply - 1 + amount)
      .mul(supply + amount)
      .mul(2 * (supply - 1 + amount) + 1)
      .div(6);
  }

  const summation = sum2.sub(sum1);
  const resultInWei = summation.mul(utils.parseEther("1")).div(16000);
  return utils.formatEther(resultInWei);
}

const data = [];
for (let supply = 0; supply <= 1000; supply += 5) {
  const price = getPrice(supply, 1); // Assuming amount = 1
  data.push({ x: supply, y: price });
}

const layout = {
  title: "Price Curve",
  xaxis: {
    title: "Supply (Shares)",
  },
  yaxis: {
    title: "Price (ETH)",
  },
};

const graphOptions = {
  layout: layout,
  filename: "price-curve",
  fileopt: "overwrite",
};

plotly.plot(data, graphOptions, function (err, msg) {
  if (err) return console.log(err);
  console.log(msg);
});
