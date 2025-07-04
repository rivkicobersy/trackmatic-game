import { ArrowLeft, ArrowRight, PauseCircle, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface GameControlsProps {
  onMove: (position: number) => void;
  currentPosition: number;
  isPaused: boolean;
  onTogglePause: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  onMove,
  currentPosition,
  isPaused,
  onTogglePause,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (e.key === "ArrowLeft") {
        onMove(currentPosition - 10);
      } else if (e.key === "ArrowRight") {
        onMove(currentPosition + 10);
      } else if (e.key === " " || e.key === "p") {
        onTogglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPosition, onMove, isPaused, onTogglePause]);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPaused) return;

    const touch = e.touches[0];
    const gameArea = e.currentTarget.getBoundingClientRect();
    const relativeX = touch.clientX - gameArea.left;
    const percentage = (relativeX / gameArea.width) * 100;

    onMove(percentage);
  };

  const handleMoveLeft = () => {
    if (!isPaused) {
      onMove(currentPosition - 10);
    }
  };

  const handleMoveRight = () => {
    if (!isPaused) {
      onMove(currentPosition + 10);
    }
  };

  return (
    <>
      {/* Mobile controls overlay */}
      {isMobile && (
        <div
          className="absolute inset-0 z-10"
          onTouchMove={handleTouchMove}
          style={{ touchAction: "none" }}
        />
      )}

      {/* Control buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        <button
          className="bg-midnight hover:bg-seafoam/20 rounded-full p-4 transition-colors"
          onClick={handleMoveLeft}
        >
          <ArrowLeft size={24} className="text-seafoam" />
        </button>
        <button
          className="bg-midnight hover:bg-seafoam/20 rounded-full p-4 transition-colors"
          onClick={handleMoveRight}
        >
          <ArrowRight size={24} className="text-seafoam" />
        </button>
      </div>

      {/* Pause button */}
      <button
        className="absolute top-4 right-4 z-20 bg-midnight rounded-full p-1 hover:bg-seafoam/20 transition-colors"
        onClick={onTogglePause}
      >
        {isPaused ? (
          <PlayCircle size={32} className="text-seafoam" />
        ) : (
          <PauseCircle size={32} className="text-seafoam" />
        )}
      </button>

      {/* Controls hint for desktop */}
      {!isMobile && (
        <div className="absolute bottom-20 left-2 text-xs text-white bg-onyx/80 p-1 rounded">
          Use ← → arrow keys to move
        </div>
      )}
    </>
  );
};

export default GameControls;
