import Square from "../components/Square";
import { useEffect, useState } from "react";

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

  if (!playOnline) {
    return (
      <>
        <div className="h-screen flex justify-center items-center">
          <button className="bg-green-500 px-5 text-lg font-bold cursor-pointer hover:bg-green-600 py-3 rounded-sm">Play Online</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          {/* Game Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-center p-4 bg-blue-300 rounded-lg flex-1 mr-4">
              <h2 className="font-bold text-lg text-blue-800">Yourself</h2>
              <p className="text-blue-600">Player O</p>
            </div>
            <div className="text-center p-4 bg-red-300 rounded-lg flex-1">
              <h2 className="font-bold text-lg text-red-800">Opponent</h2>
              <p className="text-red-600">Player X</p>
            </div>
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
                      setGameState={setGameState}
                      id={rowIndex * 3 + colIndex}
                      currentPlayer={currentPlayer}
                      setCurrentPlayer={setCurrentPlayer}
                      finishedState={finishedState}
                      finishedArrayState={finishedArrayState}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Game Status */}
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">Current Turn: Player X</div>
            {finishedState && finishedState !== "draw" && <div className="text-lg font-semibold text-green-700 mt-4">{finishedState} won the game</div>}
            {finishedState && finishedState === "draw" && <div className="text-lg font-semibold text-green-700 mt-4">Its a Draw</div>}
          </div>
        </div>
      </div>
    </>
  );
}
