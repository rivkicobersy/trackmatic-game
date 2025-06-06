import { Package, Truck as TruckIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateLeaderboard } from "../utils/gameUtils";
import FallingObject from "./FallingObject";
import GameControls from "./GameControls";
import Truck from "./Truck";

type GameObject = {
  id: number;
  x: number;
  y: number;
  type: "parcel" | "pothole";
  speed: number;
};

const Game: React.FC = () => {
  const [score, setScore] = useState(0);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [truckPosition, setTruckPosition] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const objectIdRef = useRef(0);
  const frameRef = useRef(0);
  const speedMultiplierRef = useRef(1);
  const lastSpawnTimeRef = useRef(0);
  const spawnIntervalRef = useRef(2000);
  const gameWidthRef = useRef(0);
  const navigate = useNavigate();

  const playerName = sessionStorage.getItem("playerName") || "Player";
  const playerEmail = sessionStorage.getItem("playerEmail") || "";
  const level = Math.floor(score / 100) + 1; // Optional: level display

  useEffect(() => {
    if (gameAreaRef.current) {
      gameWidthRef.current = gameAreaRef.current.clientWidth;
      window.addEventListener("resize", handleResize);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    if (gameAreaRef.current) {
      gameWidthRef.current = gameAreaRef.current.clientWidth;
    }
  };

  useEffect(() => {
    if (!gameStarted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!gameStarted && countdown === 0) {
      setGameStarted(true);
      spawnObject();
      lastSpawnTimeRef.current = performance.now();
    }
  }, [countdown, gameStarted]);

  useEffect(() => {
    if (!gameStarted || isPaused) return;

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastSpawnTimeRef.current > spawnIntervalRef.current) {
        spawnObject();
        spawnObject(); // Spawn 2 per interval for consistent pacing
        lastSpawnTimeRef.current = timestamp;
      }

      setGameObjects((prev) => {
        const updatedObjects = prev.map((obj) => ({
          ...obj,
          y: obj.y + obj.speed * speedMultiplierRef.current,
        }));

        return updatedObjects.filter((obj) => {
          if (obj.y > 90) return false;

          if (obj.y > 70 && obj.y < 85) {
            const truckLeft = truckPosition - 8;
            const truckRight = truckPosition + 8;
            const objectLeft = obj.x - 3;
            const objectRight = obj.x + 3;

            if (objectRight >= truckLeft && objectLeft <= truckRight) {
              if (obj.type === "parcel") {
                setScore((prevScore) => {
                  const newScore = prevScore + 10;

                  speedMultiplierRef.current += 0.1;
                  spawnIntervalRef.current = Math.max(
                    200,
                    spawnIntervalRef.current - 80
                  );

                  return newScore;
                });

                return false;
              } else if (obj.type === "pothole") {
                handleGameOver();
                return false;
              }
            }
          }

          return true;
        });
      });

      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(frameRef.current);
  }, [gameStarted, isPaused, score, truckPosition]);

  const spawnObject = () => {
    const randomX = Math.random() * 90 + 5;
    const objectType = Math.random() < 0.5 ? "parcel" : "pothole";
    const baseSpeed = 0.3;
    const speedVariation = Math.random() * 0.2 - 0.1;

    const newObject: GameObject = {
      id: objectIdRef.current++,
      x: randomX,
      y: 0,
      type: objectType,
      speed: baseSpeed + speedVariation,
    };

    setGameObjects((prev) => [...prev, newObject]);
  };

  const handleMoveTruck = (newPosition: number) => {
    const constrainedPosition = Math.max(10, Math.min(90, newPosition));
    setTruckPosition(constrainedPosition);
  };

  const handleGameOver = () => {
    cancelAnimationFrame(frameRef.current);
    updateLeaderboard({
      name: playerName,
      email: playerEmail,
      score,
      level,
      company: sessionStorage.getItem("playerCompany") || "",
    });

    navigate("/game-over", {
      state: { score, level },
    });
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center relative bg-onyx">
      {!gameStarted && countdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
          <div className="text-8xl font-bold text-seafoam animate-pulse">
            {countdown}
          </div>
        </div>
      )}

      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-midnight rounded-t-lg p-4 flex justify-between items-center">
          <div className="flex items-center">
            <TruckIcon className="mr-2 text-seafoam" size={24} />
            <span className="font-bold text-white">{playerName}</span>
          </div>

          <div className="flex space-x-4">
            <div className="bg-onyx px-4 py-2 rounded-md flex items-center text-white">
              <Package className="mr-2 text-seafoam" size={16} />
              <span>Score: {score}</span>
            </div>
            <div className="bg-onyx px-4 py-2 rounded-md text-white">
              Level: {level}
            </div>
          </div>
        </div>

        <div
          ref={gameAreaRef}
          className="relative bg-gray-700 overflow-hidden"
          style={{ height: "500px" }}
        >
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-full h-2 flex justify-center">
                <div className="road-marking"></div>
              </div>
            ))}
          </div>

          {gameObjects.map((obj) => (
            <FallingObject
              key={obj.id}
              type={obj.type}
              position={{ x: obj.x, y: obj.y }}
            />
          ))}

          <Truck position={truckPosition} />

          <GameControls
            onMove={handleMoveTruck}
            currentPosition={truckPosition}
            isPaused={isPaused}
            onTogglePause={togglePause}
          />

          {isPaused && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
              <div className="text-4xl font-bold text-white">PAUSED</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
