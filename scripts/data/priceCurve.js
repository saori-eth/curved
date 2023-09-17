import dotenv from "dotenv";
dotenv.config();
const { PLOTLY_API_KEY } = process.env;
import Plotly from "plotly";
import { utils, BigNumber } from "ethers";

const plotly = Plotly("saori_eth", PLOTLY_API_KEY);

const DEFAULT_CURVE = 16000;

const charts = [
  {
    title: "Friendtech Default Price Curve",
    filename: "ft-default-price-curve",
    supply: 500,
    increment: 5,
    curve: 16000,
  },
];

function getPrice(supply, amount, curve = DEFAULT_CURVE) {
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
  const resultInWei = summation.mul(utils.parseEther("1")).div(curve);
  return utils.formatEther(resultInWei);
}

const buildCurve = (supply, increment = 1) => {
  const curve = [];
  for (let i = 0; i <= supply; i += increment) {
    curve.push({ x: i, y: getPrice(i, 1) });
  }
  return curve;
};

const publishChart = (filename) => {
  // find chart with matching filename or return
  const chart = charts.find((chart) => chart.filename === filename);
  if (!chart) return;
  const options = {
    layout: {
      title: chart.title,
      xaxis: {
        title: "Supply (Shares)",
      },
      yaxis: {
        title: "Price (ETH)",
      },
    },
    filename: chart.filename,
    fileopt: "overwrite",
  };

  const data = buildCurve(chart.supply, chart.increment, chart.curve);
  plotly.plot(data, options, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
  });
};

(() => {
  const filename = charts[0].filename;
  publishChart(filename);
})();
