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

const users = {};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  // console.log("New user joined socket " + socket.id);

  users[socket.id] = {
    socket: socket,
    online: true,
  };

  socket.on("request_to_play", (data) => {
    // console.log(data, "ckck");

    const currentUser = users[socket.id];
    currentUser.playerName = data.playerName;

    // console.log(currentUser, "cucu");
  });

  socket.on("disconnect", () => {
    users[socket.id] = {
      socket: { ...socket, online: false },
      online: true,
    };
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
