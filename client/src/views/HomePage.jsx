import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Navbar */}
      <nav className="bg-black/30 backdrop-blur-sm p-6 w-full fixed top-0 flex justify-center shadow-lg z-50">
        <div className="flex justify-center items-center space-x-12 max-w-4xl w-full px-4">
          <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">SatuDuaTiga</h1>
          {/* <div className="flex space-x-8 ml-auto text-lg"> */}
          {/* <a href="#" className="relative group">
              <span className="text-white/90 hover:text-white transition-colors">Home</span>
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </a> */}
          {/* <a href="#" className="relative group">
              <span className="text-white/90 hover:text-white transition-colors">Login</span>
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </a> */}
          {/* </div> */}
        </div>
      </nav>

      {/* Content */}
      <div className="mt-20 text-center z-10 px-4">
        <h2 className="text-6xl font-bold mb-8 drop-shadow-lg animate-fadeIn bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">START A NEW GAME</h2>
        <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">Challenge yourself with our exciting game collection. Start playing now and have fun!</p>

        {/* Game Cards Grid */}
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {/* Game Card 1 */}
          <div className="transform hover:scale-105 transition-all duration-300 w-full md:w-[400px] h-[300px]">
            <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl hover:shadow-yellow-500/30 group h-full flex flex-col">
              <div className="flex-1">
                <span className="text-5xl animate-bounce block mb-2">🎮</span>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">TicTacToe</h3>
                <p className="text-white/70">Classic game of X and O. Challenge your friends!</p>
              </div>
              <button
                className="w-full cursor-pointer py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-lg font-bold rounded-xl 
                shadow-lg group-hover:shadow-yellow-500/50 transition-all duration-300 
                hover:from-yellow-500 hover:to-yellow-700 transform hover:-translate-y-1"
                onClick={() => navigate("/tic-tac-toe")}
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-white/60 text-sm">&copy; 2024 SatuDuaTiga. All rights reserved.</footer>
    </div>
  );
}
