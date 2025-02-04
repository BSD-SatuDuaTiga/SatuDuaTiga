import { BrowserRouter, Routes, Route } from "react-router";
import TicTacToe from "./views/TicTacToe";
import HomePage from "./views/HomePage";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
