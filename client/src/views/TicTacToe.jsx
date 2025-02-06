import { useNavigate } from "react-router";
import Square from "../components/Square";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { useMusic } from "../context/MusicContext";
import Chat from "../components/Chat";
// import Toastify from "toastify-js";

const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export default function TicTacToe() {
  const [gameState, setGameState] = useState(renderFrom); // State untuk menyimpan state game
  const [currentPlayer, setCurrentPlayer] = useState("circle"); // State untuk menyimpan pemain saat ini
  const [finishedState, setFinishedState] = useState(false); // State untuk menyimpan status game selesai
  const [finishedArrayState, setFinishedArrayState] = useState([]); // State untuk menyimpan array index yang memenangkan game
  const [playOnline, setPlayOnline] = useState(false); // State untuk menyimpan status bermain online
  const [socket, setSocket] = useState(null); // State untuk menyimpan socket
  const [playerName, setPlayerName] = useState(""); // State untuk menyimpan nama pemain
  const [opponentName, setOpponentName] = useState(""); // State untuk menyimpan nama lawan
  const [playingAs, setPlayingAs] = useState(null); // State untuk menyimpan pemain yang dipilih
  const [messageSent, setMessageSent] = useState(""); // State untuk menyimpan pesan yang akan dikirim
  const [messages, setMessages] = useState([]); // State untuk menyimpan pesan yang sudah dikirim
  const navigate = useNavigate(); // Fungsi untuk mengalihkan halaman
  const { startMusic, stopMusic } = useMusic(); // Fungsi untuk memulai dan menghentikan musik

  const checkWinner = () => {
    // Cek baris
    for (let row = 0; row < gameState.length; row++) {
      if (gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]) {
        setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);

        return gameState[row][0];
      }
    }

    // Cek kolom
    for (let col = 0; col < gameState.length; col++) {
      if (gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]) {
        setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return gameState[0][col];
      }
    }

    // Cek diagonal
    if (gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
      return gameState[0][0];
    }

    // Cek diagonal kedua
    if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
      return gameState[0][2];
    }

    // Cek draw
    const isDrawMatch = gameState.flat().every((e) => {
      if (e === "circle" || e === "cross") return true;
    });

    if (isDrawMatch) return "draw";

    return null;
  };

  // Effect untuk mengecek pemenang
  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setFinishedState(winner);
      stopMusic();
    }
  }, [gameState]);

  // Start music when opponent is found
  useEffect(() => {
    if (opponentName) {
      startMusic();
    }
    return () => {
      stopMusic();
    };
  }, [opponentName]);

  // Fungsi untuk mengambil nama pemain
  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      inputLabel: "name",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });
    return result;
  };

  // Fungsi untuk mengirim pesan
  function handleSubmit(e) {
    e.preventDefault();
    if (!messageSent.trim()) return;

    socket.emit("message:new", {
      from: playerName,
      message: messageSent,
    });

    setMessageSent("");
  }

  // Effect untuk mengupdate pesan
  useEffect(() => {
    if (!socket) return;

    socket.on("message:update", (newMessage) => {
      setMessages((current) => [...current, newMessage]);
    });

    return () => {
      socket.off("message:update");
    };
  }, [socket]);

  // Effect untuk menangani keluar dari game
  socket?.on("opponentLeftMatch", () => {
    Swal.fire({ title: "You Won Opponent Left Match" }).then((result) => {
      setFinishedState("opponentLeftMatch");
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  });

  // untuk menangani pergerakan dari server
  socket?.on("playerMoveFromServer", function (data) {
    const id = data.state.id;
    setGameState((prevState) => {
      let newState = [...prevState];
      const rowIndex = Math.floor(id / 3);
      const colIndex = id % 3;
      newState[rowIndex][colIndex] = data.state.sign;

      return newState;
    });
    setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");
  });

  //  untuk menangani koneksi socket
  socket?.on("connect", function () {
    setPlayOnline(true);
  });

  // untuk menangani jika lawan tidak ditemukan
  socket?.on("OpponentNotFound", function () {
    setOpponentName(false);
  });

  // untuk menangani jika lawan ditemukan
  socket?.on("OpponentFound", function (data) {
    // console.log(data);

    // Mengatur pemain yang dipilih
    setPlayingAs(data.playingAs);

    // Mengatur nama lawan
    setOpponentName(data.opponentName);
  });

  // Fungsi untuk memulai bermain online
  async function handlePlayOnline() {
    const result = await takePlayerName();

    // Jika pemain tidak mengonfirmasi, tidak ada aksi
    if (!result.isConfirmed) {
      return;
    }

    // Mengatur nama pemain
    const username = result.value;
    setPlayerName(username);

    // Membuat socket baru
    const newSocket = io("https://api.robbysuganda.tech", {
      autoConnect: true,
    });

    // Mengirim permintaan bermain ke server
    newSocket?.emit("request_to_play", {
      playerName: username,
    });

    // Mengatur socket baru
    setSocket(newSocket);
  }

  async function handlePlayAgain() {
    setPlayOnline(false);
  }

  // Jika tidak bermain online
  if (!playOnline) {
    return (
      <>
        <div className="h-screen flex justify-center items-center">
          <button onClick={handlePlayOnline} className="bg-green-500 px-5 text-lg font-bold cursor-pointer hover:bg-green-600 py-3 rounded-sm">
            Play Online
          </button>
          <button onClick={() => navigate("/")} className="bg-gray-500 ml-3 px-5 text-lg font-bold cursor-pointer hover:bg-gray-600 py-3 rounded-sm">
            Back
          </button>
        </div>
      </>
    );
  }

  // Jika bermain online dan lawan tidak ditemukan
  if (playOnline && !opponentName) {
    return (
      <>
        <div className="h-screen flex justify-center items-center">
          <div className="text-xl font-bold text-white">Waiting for opponent . . . .</div>
        </div>
      </>
    );
  }

  // Jika bermain online dan lawan ditemukan
  return (
    <div className="min-h-screen bg-[#1f1f2f] flex justify-center items-center p-4">
      <div className="game-container flex gap-8">
        {/* Game Section */}
        <div className="game-board">
          {/* Game Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-center">
              <div
                className={`player-indicator ${playingAs === "circle" ? "bg-blue-600" : "bg-blue-400"} ${
                  (playingAs === "circle" && currentPlayer === "circle") || (playingAs === "cross" && currentPlayer === "cross") ? "player-active" : ""
                }`}
              >
                {playerName}
                {playingAs === "circle" && <span className="ml-2 font-bold">(O)</span>}
                {playingAs === "cross" && <span className="ml-2 font-bold">(X)</span>}
              </div>
            </div>

            <div className="text-center">
              <div
                className={`player-indicator ${playingAs === "cross" ? "bg-red-600" : "bg-red-400"} ${(playingAs !== "circle" && currentPlayer === "circle") || (playingAs !== "cross" && currentPlayer === "cross") ? "player-active" : ""}`}
              >
                {opponentName}
                {playingAs !== "circle" && <span className="ml-2 font-bold">(O)</span>}
                {playingAs !== "cross" && <span className="ml-2 font-bold">(X)</span>}
              </div>
            </div>
          </div>

          {/* Turn Indicator */}
          <div className="text-center mb-4">
            {!finishedState && (
              <>
                {(playingAs === "circle" && currentPlayer === "circle") || (playingAs === "cross" && currentPlayer === "cross") ? (
                  <div className="text-green-400 text-lg font-semibold">Your Turn ( {playerName} )</div>
                ) : (
                  <div className="text-green-400 text-lg font-semibold">{opponentName} Turn's</div>
                )}
              </>
            )}
          </div>

          {/* Game Grid */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-white">Tic Tac Toe</h1>
            <div className="grid grid-cols-3 gap-4 max-w-[350px] mx-auto">
              {gameState.map((arr, rowIndex) =>
                arr.map((e, colIndex) => {
                  return (
                    <Square
                      key={rowIndex * 3 + colIndex}
                      socket={socket}
                      gameState={gameState}
                      setGameState={setGameState}
                      id={rowIndex * 3 + colIndex}
                      currentPlayer={currentPlayer}
                      setCurrentPlayer={setCurrentPlayer}
                      finishedState={finishedState}
                      finishedArrayState={finishedArrayState}
                      currentElement={e}
                      playingAs={playingAs}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Game Status */}
          <div className="status-container">
            {finishedState && finishedState !== "opponentLeftMatch" && finishedState !== "draw" && <div className="text-lg font-semibold text-green-700">{finishedState === playingAs ? "You" : opponentName} won the game</div>}

            {finishedState && finishedState === "draw" && <div className="text-lg font-semibold text-green-700">Its a Draw</div>}
            {!finishedState && opponentName && <div className="text-lg font-semibold text-gray-200">Playing against {opponentName}</div>}
            {finishedState && finishedState === "opponentLeftMatch" && <div className="text-lg font-semibold text-gray-700">You won opponent left the match</div>}
          </div>
          <div className="flex justify-center mt-3">
            {finishedState && finishedState !== "opponentLeftMatch" && (
              <button onClick={handlePlayAgain} className="bg-green-500 text-md font-bold cursor-pointer hover:bg-green-600 rounded-sm">
                Play Again
              </button>
            )}
          </div>
        </div>

        <Chat messages={messages} playerName={playerName} handleSubmit={handleSubmit} messageSent={messageSent} setMessageSent={setMessageSent} />
      </div>
    </div>
  );
}
