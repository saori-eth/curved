const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Express route
app.get("/", (req, res) => {
  res.send("HTTP Server is running.");
});

// WebSocket connection
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
