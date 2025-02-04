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

    let opponentPlayer;

    for (const key in users) {
      const user = users[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user;
        break;
      }
    }
    // console.log(opponentPlayer, "opponentPlayer");

    if (opponentPlayer) {
      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "circle",
      });

      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "cross",
      });

      currentUser.socket.on("playerMoveFromClient", (data) => {
        // console.log(data, "data");
        opponentPlayer.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        // console.log(data, "data");
        currentUser.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });
    } else {
      currentUser.socket.emit("OpponentNotFound");
    }
  });

  socket.on("disconnect", () => {
    const currentUser = users[socket.id];
    currentUser.online = false;
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
