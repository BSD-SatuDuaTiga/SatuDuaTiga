import { BrowserRouter, Routes, Route } from "react-router";
import TicTacToe from "./views/TicTacToe";
import HomePage from "./views/HomePage";
import { MusicProvider } from "./context/MusicContext";
import { ThemeProvider } from "./context/Theme";
import FlipCard from "./views/FlipCard";
import "./App.css";

export default function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/flip-card" element={<FlipCard />} />
          </Routes>
        </BrowserRouter>
      </MusicProvider>
    </ThemeProvider>
  );
}
