import { Home, RotateCcw, Trophy, Truck } from "lucide-react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateLeaderboard } from "../utils/gameUtils";

const GameOver: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score = 0, level = 1 } = location.state || {};
  const playerName = sessionStorage.getItem("playerName") || "Player";
  const playerEmail = sessionStorage.getItem("playerEmail") || "";

  const [displayScore, setDisplayScore] = React.useState(0);

  useEffect(() => {
    if (displayScore < score) {
      const interval = setInterval(() => {
        setDisplayScore((prev) => {
          const increment = Math.max(1, Math.floor((score - prev) / 10));
          return Math.min(prev + increment, score);
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [score, displayScore]);

  useEffect(() => {
    if (playerEmail && playerName) {
      updateLeaderboard({
        name: playerName,
        email: playerEmail,
        score,
        level,
      });
    }
  }, [playerName, playerEmail, score, level]);

  const handlePlayAgain = () => {
    navigate("/game");
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="max-w-md w-full bg-midnight-900 rounded-lg shadow-xl overflow-hidden">
        <div className="bg-midnight-800 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Game Over</h1>
          <div className="flex justify-center">
            <Truck className="text-seafoam mr-2" size={24} />
            <span className="text-lg">{playerName}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="inline-block bg-midnight-800 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="text-seafoam mr-2" size={28} />
                <h2 className="text-xl font-bold">Final Score</h2>
              </div>
              <div className="text-4xl font-bold text-seafoam">
                {displayScore}
              </div>
              <div className="mt-2">
                Level Reached: <span className="font-bold">{level}</span>
              </div>
            </div>
          </div>

          <div className="bg-midnight-950 rounded-lg p-4 text-center">
            {score > 500 ? (
              <>
                <p className="text-lg font-bold text-green-400">Outstanding!</p>
                <p>You're a delivery champion!</p>
              </>
            ) : score > 200 ? (
              <>
                <p className="text-lg font-bold text-amber-400">Well Done!</p>
                <p>You're becoming a skilled driver.</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-seafoam">Good Start!</p>
                <p>Keep practicing to improve your skills.</p>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePlayAgain}
              className="flex-1 bg-midnight hover:bg-seafoam text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
            >
              <RotateCcw className="mr-2" size={20} />
              Play Again
            </button>

            <button
              onClick={handleReturnHome}
              className="flex-1 bg-midnight-600 hover:bg-midnight-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
            >
              <Home className="mr-2" size={20} />
              Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
