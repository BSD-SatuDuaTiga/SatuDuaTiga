/* eslint-disable react/prop-types */
import "../styles/singleCard.css";

export default function SingleCard({ card, handleChoice, flipped }) {
  const handleClick = () => {
    handleChoice(card);
  };

  return (
    <div className={`card ${card.matched ? "matched" : ""}`}>
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={card.src} alt="card front" />
        <img className="back" src="https://th.bing.com/th/id/OIP.G6xeHIWOKjnERufeALuZgAHaHa?w=210&h=210&c=7&r=0&o=5&dpr=1.5&pid=1.7" onClick={handleClick} alt="card back" />
      </div>
    </div>
  );
}
