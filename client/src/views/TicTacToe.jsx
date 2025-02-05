import Square from "../components/Square";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

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

    // console.log(isDrawMatch);

    if (isDrawMatch) return "draw";

    return null;
  };

  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setFinishedState(winner);
    }
  }, [gameState]);

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
    // console.log("Got data from server");
    // setCurrentPlayer(data.state.currentPlayer);

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
    // console.log(data);

    setPlayingAs(data.playingAs);
    setOpponentName(data.opponentName);
  });

  async function handlePlayOnline() {
    const result = await takePlayerName();
    // console.log(result);

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
      <div className="min-h-screen bg-[#1f1f2f] flex justify-center items-center p-4">
        <div className="flex gap-8">
          {/* Game Section */}
          <div className="bg-gray-300 rounded-lg shadow-lg p-8 max-w-md">
            {/* Game Header */}
            <div className="flex justify-between items-center mb-8">
              <div className={`left px-4 py-2 rounded-lg bg-blue-500 text-white ${currentPlayer === playingAs ? "ring-2 ring-yellow-400" : ""}`}>{playerName}</div>
              <div className={`right px-4 py-2 rounded-lg bg-red-500 text-white ${currentPlayer !== playingAs ? "ring-2 ring-yellow-400" : ""}`}>{opponentName}</div>
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
            <div className="text-center bg-white p-3 rounded-lg shadow">
              {finishedState && finishedState !== "draw" && <div className="text-lg font-semibold text-green-700">{finishedState === playingAs ? "You" : opponentName} won the game</div>}
              {finishedState && finishedState === "draw" && <div className="text-lg font-semibold text-blue-700">Its a Draw</div>}
              {!finishedState && opponentName && <div className="text-lg font-semibold text-gray-700">Playing against {opponentName}</div>}
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-lg shadow-lg w-96 flex flex-col">
            <div className="p-4 bg-gray-800 text-white rounded-t-lg">
              <h2 className="text-xl font-semibold">Game Chat</h2>
            </div>

            <div className="flex-grow p-4 overflow-auto h-[400px] bg-gray-100">
              <div className="space-y-4">
                <div className="chat chat-end">
                  <div className="chat-bubble bg-blue-500 text-white p-3 rounded-lg max-w-[80%]">Hello there!</div>
                </div>
                <div className="chat chat-start">
                  <div className="chat-bubble bg-gray-300 p-3 rounded-lg max-w-[80%]">Hi! Ready to play?</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <form className="flex gap-2">
                <input type="text" placeholder="Type your message…" className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
