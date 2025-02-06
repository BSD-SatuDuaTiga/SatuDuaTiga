if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { createServer } = require("http");
const { Server } = require("socket.io");

// Konfigurasi Socket.IO dengan CORS
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://satuduatiga.vercel.app"],
  },
});

// Menyimpan data pengguna dan ruangan
const users = {};
const allRoms = [];

// Menangani koneksi socket baru
io.on("connection", (socket) => {
  // Menyimpan informasi pengguna baru
  users[socket.id] = {
    socket: socket,
    online: true,
  };

  // Menangani permintaan bermain
  socket.on("request_to_play", (data) => {
    const currentUser = users[socket.id];
    currentUser.playerName = data.playerName;

    // Mencari lawan yang tersedia
    let opponentPlayer;
    for (const key in users) {
      const user = users[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user;
        break;
      }
    }

    if (opponentPlayer) {
      // Jika lawan ditemukan, buat ruangan baru
      allRoms.push({
        player1: opponentPlayer,
        player2: currentUser,
      });

      // Mengirim informasi ke kedua pemain
      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "circle",
      });

      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "cross",
      });

      // Menangani perpindahan pemain
      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });
    } else {
      // Jika tidak ada lawan, kirim notifikasi
      currentUser.socket.emit("OpponentNotFound");
    }
  });

  // Menangani pesan chat
  socket.on("message:new", (data) => {
    io.emit("message:update", {
      from: data.from,
      message: data.message,
    });
  });

  // Menangani disconnect
  socket.on("disconnect", () => {
    const currentUser = users[socket.id];
    currentUser.online = false;
    currentUser.playing = false;

    // Memberitahu lawan jika pemain keluar
    for (let index = 0; index < allRoms.length; index++) {
      const { player1, player2 } = allRoms[index];

      if (player1.socket.id === socket.id) {
        player2.socket.emit("opponentLeftMatch");
        break;
      }

      if (player2.socket.id === socket.id) {
        player1.socket.emit("opponentLeftMatch");
        break;
      }
    }
  });
});

// Menjalankan server
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
