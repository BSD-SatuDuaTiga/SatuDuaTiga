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

const users = [];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  // ...
  // console.log("New user joined socket " + socket.id);
  users.push({
    socket: socket,
    online: true,
  });

  socket.on("disconnect", () => {
    for (let i = 0; i < users.length; i++) {
      if (users[i] === socket.id) {
        users.online = false;
      }
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
