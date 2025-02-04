const express = require("express");
const app = express();
const port = 3000;
const { createServer } = require("http");
const { Server } = require("socket.io");

// Socket Io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
