const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { DB } = require("./DB.js");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const db = new DB();

app.get("/", (req, res) => {
  res.send("HTTP Server is running.");
});

/****************************************
 * Database endpoints
 ****************************************/

app.get("/content", async (req, res) => {
  const validKeys = ["shareId", "owner"];
  if (Object.keys(req.query).length === 0) {
    const content = await db.fetchAll("content");
    res.send(content);
    return;
  }
  if (!Object.keys(req.query).every((key) => validKeys.includes(key))) {
    return res.status(400).send("Invalid query.");
  }
  let condition = "1=1"; // Default condition that's always true
  if (req.query.id) {
    condition += ` AND id = ${req.query.id}`;
  } else {
    if (req.query.shareId) {
      condition += ` AND shareId = "${req.query.shareId}"`;
    }
    if (req.query.owner) {
      condition += ` AND owner = "${req.query.owner}"`;
    }
  }

  try {
    const content = await db.fetchOne("content", condition);
    if (content) {
      res.send(content);
    } else {
      res.status(404).send("Content not found.");
    }
  } catch (err) {
    res.status(500).send("Internal server error.");
  }
});

app.get("/users", async (req, res) => {
  const validKeys = ["username", "address"];
  if (Object.keys(req.query).length === 0) {
    const users = await db.fetchAll("users");
    res.send(users);
    return;
  }
  if (!Object.keys(req.query).every((key) => validKeys.includes(key))) {
    return res.status(400).send("Invalid query.");
  }

  let condition = "1=1"; // Default condition that's always true
  if (req.query.id) {
    condition += ` AND id = ${req.query.id}`;
  } else {
    if (req.query.username) {
      condition += ` AND username = "${req.query.username}"`;
    }
    if (req.query.address) {
      condition += ` AND address = "${req.query.address}"`;
    }
  }

  try {
    const users = await db.fetchOne("users", condition);
    if (users) {
      res.send(users);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    res.status(500).send("Internal server error.");
  }
});

app.get("/trades", async (req, res) => {
  const validKeys = ["side", "trader", "owner", "amount", "price", "supply"];
  if (Object.keys(req.query).length === 0) {
    const trades = await db.fetchAll("trades");
    res.send(trades);
    return;
  }
  if (!Object.keys(req.query).every((key) => validKeys.includes(key))) {
    return res.status(400).send("Invalid query.");
  }

  let condition = "1=1"; // Default condition that's always true
  if (req.query.id) {
    condition += ` AND id = ${req.query.id}`;
  } else {
    if (req.query.side) {
      condition += ` AND side = ${req.query.side}`;
    }
    if (req.query.trader) {
      condition += ` AND trader = "${req.query.trader}"`;
    }
    if (req.query.owner) {
      condition += ` AND owner = "${req.query.owner}"`;
    }
    if (req.query.amount) {
      condition += ` AND amount = ${req.query.amount}`;
    }
    if (req.query.price) {
      condition += ` AND price = "${req.query.price}"`;
    }
    if (req.query.supply) {
      condition += ` AND supply = ${req.query.supply}`;
    }
  }

  try {
    const trades = await db.fetchOne("trades", condition);
    if (trades) {
      res.send(trades);
    } else {
      res.status(404).send("Trade not found.");
    }
  } catch (err) {
    res.status(500).send("Internal server error.");
  }
});

app.get("/balances", async (req, res) => {
  const validKeys = ["address"];
  if (Object.keys(req.query).length === 0) {
    const balances = await db.getAllUserBalances();
    res.send(balances);
    return;
  } else if (!Object.keys(req.query).every((key) => validKeys.includes(key))) {
    return res.status(400).send("Invalid query.");
  }

  try {
    const balances = await db.getUserBalances(req.query.address);
    if (balances) {
      res.send(balances);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    res.status(500).send("Internal server error.");
  }
});

/****************************************
 * WebSocket endpoints
 *****************************************/

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.send("WebSocket connection established.");
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Curved API is running on http://localhost:${PORT}`);
});
