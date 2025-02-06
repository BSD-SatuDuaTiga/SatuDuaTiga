import { useState } from "react";

const circleSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
    </g>
  </svg>
);

const crossSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path d="M19 5L5 19M5.00001 5L19 19" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
    </g>
  </svg>
);

export default function Square({ currentElement, playingAs, socket, setGameState, id, currentPlayer, setCurrentPlayer, finishedState, finishedArrayState }) {
  const [icon, setIcon] = useState(null);

  // Fungsi untuk menangani klik pada kotak
  const clickOnSquare = () => {
    //   mengecek apakah kotak sudah terisi
    if (currentElement === "circle" || currentElement === "cross") {
      return;
    }

    // Jika pemain tidak sesuai, tidak ada aksi
    if (currentPlayer !== playingAs) {
      return;
    }

    // Jika game sudah selesai, tidak ada aksi
    if (finishedState) {
      return;
    }

    // Jika kotak belum memiliki ikon
    if (!icon) {
      // Menentukan ikon berdasarkan pemain saat ini
      if (currentPlayer === "circle") {
        setIcon(circleSvg);
      } else {
        setIcon(crossSvg);
      }

      // Mengirim pergerakan ke server
      const myCurrentPlayer = currentPlayer;

      socket.emit("playerMoveFromClient", {
        state: {
          id,
          sign: myCurrentPlayer,
        },
      });

      // Mengubah pemain saat ini

      setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");

      // Mengubah state game
      setGameState((prevState) => {
        let newState = [...prevState];
        const rowIndex = Math.floor(id / 3);
        const colIndex = id % 3;
        newState[rowIndex][colIndex] = myCurrentPlayer;

        return newState;
      });
    }
  };

  return (
    <>
      <div
        onClick={clickOnSquare}
        className={`w-20 h-20 bg-blue-100  rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center text-3xl font-bold shadow-sm ${
          finishedState || currentElement === "circle" || currentElement === "cross" ? "cursor-not-allowed" : ""
        } ${currentPlayer !== playingAs ? "cursor-not-allowed" : "cursor-pointer"} ${finishedArrayState.includes(id) ? finishedState + "-won" : ""} ${finishedState && finishedState !== playingAs ? "bg-grey-400" : ""}`}
      >
        {currentElement === "circle" ? circleSvg : currentElement === "cross" ? crossSvg : icon}
      </div>
    </>
  );
}
