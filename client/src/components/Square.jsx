export default function Square({ value, onSquareClick }) {
  return (
    <>
      <button className="square border-2 p-4" onClick={onSquareClick}>
        {value}
      </button>
    </>
  );
}
