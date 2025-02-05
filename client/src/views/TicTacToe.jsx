import Square from "../components/Square";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { useMusic } from "../context/MusicContext";

const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export default function TicTacToe() {
  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [finishedState, setFinishedState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [playingAs, setPlayingAs] = useState(null);
  const { startMusic, stopMusic } = useMusic();

  const checkWinner = () => {
    // row
    for (let row = 0; row < gameState.length; row++) {
      if (gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]) {
        setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);

        return gameState[row][0];
      }
    }

    // column
    for (let col = 0; col < gameState.length; col++) {
      if (gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]) {
        setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return gameState[0][col];
      }
    }

    if (gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
      return gameState[0][0];
    }

    if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
      return gameState[0][2];
    }

    const isDrawMatch = gameState.flat().every((e) => {
      if (e === "circle" || e === "cross") return true;
    });

    if (isDrawMatch) return "draw";

    return null;
  };

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

  socket?.on("connect", function () {
    setPlayOnline(true);
  });

  socket?.on("OpponentNotFound", function () {
    setOpponentName(false);
  });

  socket?.on("OpponentFound", function (data) {
    setPlayingAs(data.playingAs);
    setOpponentName(data.opponentName);
  });

  async function handlePlayOnline() {
    const result = await takePlayerName();

    if (!result.isConfirmed) {
      return;
    }

    const username = result.value;
    setPlayerName(username);

    const newSocket = io("http://localhost:3000", {
      autoConnect: true,
    });

    newSocket?.emit("request_to_play", {
      playerName: username,
    });

    setSocket(newSocket);
  }

  if (!playOnline) {
    return (
      <>
        <div className="h-screen flex justify-center items-center">
          <button onClick={handlePlayOnline} className="bg-green-500 px-5 text-lg font-bold cursor-pointer hover:bg-green-600 py-3 rounded-sm">
            Play Online
          </button>
        </div>
      </>
    );
  }

  if (playOnline && !opponentName) {
    return (
      <>
        <div className="h-screen flex justify-center items-center">
          <div className="text-xl font-bold text-white">Waiting for opponent . . . .</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg[#1f1f2f] flex justify-center items-center p-4">
        <div className="bg-gray-300 rounded-lg shadow-lg p-8 max-w-md w-full">
          {/* Game Header */}
          <div className="flex justify-between items-center mb-8">
            <div className={`left ${currentPlayer === playingAs ? "current-move-" + currentPlayer : ""}`}>{playerName}</div>
            <div className={`right ${currentPlayer !== playingAs ? "current-move-" + currentPlayer : ""}`}>{opponentName}</div>
          </div>

          {/* Game Board */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Tic Tac Toe</h1>
            <div className="grid grid-cols-3 gap-3 max-w-[300px] mx-auto">
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
          <div className="text-center">
            {finishedState && finishedState !== "draw" && <div className="text-lg font-semibold text-green-700 mt-4">{finishedState === playingAs ? "You" : opponentName} won the game</div>}
            {finishedState && finishedState === "draw" && <div className="text-lg font-semibold text-green-700 mt-4">Its a Draw</div>}
            {!finishedState && opponentName && <div className="text-lg font-semibold text-green-700 mt-4">You are playing against {opponentName} </div>}
          </div>
        </div>
      </div>
    </>
  );
}
