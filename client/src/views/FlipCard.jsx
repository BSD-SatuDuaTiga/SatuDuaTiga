import { useState, useEffect } from "react";
import SingleCard from "../components/SingleCard";

const cardImg = [
  { "src": "https://th.bing.com/th/id/OIP.V8oSrKn5WARwyuMvR5OpsAHaFj?w=222&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false},
  { "src": "https://th.bing.com/th/id/OIP.zEKgsoxhkPDY-ktz_HPz_gHaE7?w=200&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false},
  { "src": "https://th.bing.com/th/id/OIP.ZRc10AvHUe5F8XsMzS2d5gHaF7?w=216&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false},
  { "src": "https://th.bing.com/th/id/OIP.bdJcUnORzC1bPZc0MmKBfQHaEK?w=280&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false},
  { "src": "https://th.bing.com/th/id/OIP.Pj47z3xwEoJBs861VT8cnwHaGN?w=218&h=182&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false},
  { "src": "https://th.bing.com/th/id/OIP.V8oSrKn5WARwyuMvR5OpsAHaFj?w=222&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7", matched: false}
];

export default function FlipCard() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);

  const suffleCards = () => {
    const suffleCards = [...cardImg, ...cardImg]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
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
  }

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return {...card, matched: true}
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
  }
  
  return (
    <div className="App">
      <h1>✨ Memory Game ✨</h1>
      <button className="Button" onClick={suffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard 
            key={card.id} 
            card={card} 
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
          />
        ))} 
      </div>
      <p>Turns: {turns}</p>
    </div>
  );
}