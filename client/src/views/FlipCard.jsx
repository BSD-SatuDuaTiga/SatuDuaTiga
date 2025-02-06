import { useState, useEffect } from "react";
import SingleCard from "../components/SingleCard";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
const cardImg = [
  { src: "https://th.bing.com/th/id/OIP.V8oSrKn5WARwyuMvR5OpsAHaFj?w=222&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false },
  { src: "https://th.bing.com/th/id/OIP.zEKgsoxhkPDY-ktz_HPz_gHaE7?w=200&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false },
  { src: "https://th.bing.com/th/id/OIP.ZRc10AvHUe5F8XsMzS2d5gHaF7?w=216&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false },
  { src: "https://th.bing.com/th/id/OIP.bdJcUnORzC1bPZc0MmKBfQHaEK?w=280&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false },
  { src: "https://th.bing.com/th/id/OIP.Pj47z3xwEoJBs861VT8cnwHaGN?w=218&h=182&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false },
  { src: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/10/28064854/12.-Tips-Merawat-Anak-Kucing-Munchkin.jpg", matched: false },
];
export default function FlipCard() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const navigate = useNavigate();

  const suffleCards = () => {
    const suffleCards = [...cardImg, ...cardImg].sort(() => Math.random() - 0.5).map((card) => ({ ...card, id: Math.random() }));
    setCards(suffleCards);
    setTurns(0);
  };
  useEffect(() => {
    suffleCards();
  }, []);
  const handleChoice = (card) => {
    if (choiceOne && choiceTwo) return;
    if (card === choiceOne) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          const updatedCards = prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });

          // Cek apakah semua kartu sudah terbuka
          const allMatched = updatedCards.every((card) => card.matched);
          if (allMatched) {
            Swal.fire({
              title: "Selamat!",
              text: `Anda telah menyelesaikan permainan dalam ${turns + 1} giliran!`,
              icon: "success",
              confirmButtonText: "Main Lagi",
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                suffleCards();
              }
            });
          }

          return updatedCards;
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
  };

  return (
    <div className="App">
      <h1 className="text-2xl">✨ Memory Game ✨</h1>
      <button className="Button mt-2" onClick={suffleCards}>
        New Game
      </button>
      <div className="card-grid mb-2">
        {cards.map((card) => (
          <SingleCard key={card.id} card={card} handleChoice={handleChoice} flipped={card === choiceOne || card === choiceTwo || card.matched} />
        ))}
      </div>
      <p className="text-lg text-bold">Turns: {turns}</p>
      <button className="bg-gray-500 ml-3 px-5 mt-2 text-lg font-bold cursor-pointer hover:bg-gray-600 py-3 rounded-sm" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}
