import { useNavigate } from "react-router";
import { useTheme } from "../context/Theme";
import { FaSun, FaMoon } from "react-icons/fa";

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900" : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"}`}>
      {/* Navbar */}
      <nav className={`${theme === "dark" ? "bg-black/30 text-white" : "bg-white/30 text-gray-800"} backdrop-blur-sm p-6 w-full fixed top-0 flex justify-between items-center shadow-lg z-50`}>
        <div className="flex items-center space-x-12 max-w-4xl w-full px-4">
          <h1
            className={`text-3xl font-extrabold tracking-wider ${
              theme === "dark" ? "bg-gradient-to-r from-yellow-200 to-yellow-500" : "bg-gradient-to-r from-purple-600 to-pink-600"
            } bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer`}
          >
            SatuDuaTiga
          </h1>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${theme === "dark" ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400" : "bg-purple-600 text-white hover:bg-purple-700"}`}
        >
          {theme === "dark" ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
        </button>
      </nav>

      {/* Content */}
      <div className="flex-1 mt-20 text-center z-10 px-4 pt-12">
        <h2
          className={`text-6xl font-bold mb-8 drop-shadow-lg animate-fadeIn ${
            theme === "dark" ? "bg-gradient-to-r from-white via-yellow-200 to-white" : "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"
          } bg-clip-text text-transparent`}
        >
          START A NEW GAME
        </h2>
        <p className={`text-lg mb-12 max-w-2xl mx-auto ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>Challenge yourself with our exciting game collection. Start playing now and have fun!</p>

        {/* Game Cards Grid */}
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {/* Game Card */}
          <div className="transform hover:scale-105 transition-all duration-300 w-full md:w-[400px] h-[300px]">
            <div className={`${theme === "dark" ? "bg-black/30 border-white/20" : "bg-white/30 border-purple-200"} backdrop-blur-md p-6 rounded-2xl border shadow-2xl group h-full flex flex-col`}>
              <div className="flex-1">
                <span className="text-5xl animate-bounce block mb-2">🎮</span>
                <h3 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "bg-gradient-to-r from-yellow-200 to-yellow-500" : "bg-gradient-to-r from-purple-600 to-pink-600"} bg-clip-text text-transparent`}>TicTacToe</h3>
                <p className={theme === "dark" ? "text-white/70" : "text-gray-700"}>Classic game of X and O. Challenge your friends!</p>
              </div>
              <button
                onClick={() => navigate("/tic-tac-toe")}
                className={`w-full cursor-pointer py-3 text-lg font-bold rounded-xl 
                shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                  theme === "dark" ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                }`}
              >
                Play Now
              </button>
            </div>
          </div>

          {/* Game Card */}
          <div className="transform hover:scale-105 transition-all duration-300 w-full md:w-[400px] h-[300px]">
            <div className={`${theme === "dark" ? "bg-black/30 border-white/20" : "bg-white/30 border-purple-200"} backdrop-blur-md p-6 rounded-2xl border shadow-2xl group h-full flex flex-col`}>
              <div className="flex-1">
                <span className="text-5xl animate-bounce block mb-2">🎮</span>
                <h3 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "bg-gradient-to-r from-yellow-200 to-yellow-500" : "bg-gradient-to-r from-purple-600 to-pink-600"} bg-clip-text text-transparent`}>Memory Game</h3>
                <p className={theme === "dark" ? "text-white/70" : "text-gray-700"}>Test Your Memory in This Game</p>
              </div>
              <button
                onClick={() => navigate("/flip-card")}
                className={`w-full cursor-pointer py-3 text-lg font-bold rounded-xl 
                shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                  theme === "dark" ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                }`}
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`w-full flex justify-center items-center py-6 ${theme === "dark" ? "bg-black/30 text-white/80" : "bg-white/30 text-gray-700"}`}>
        <p className={`text-sm font-medium ${theme === "dark" ? "bg-gradient-to-r from-yellow-200 to-yellow-500" : "bg-gradient-to-r from-purple-600 to-pink-600"} bg-clip-text text-transparent`}>
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
}
