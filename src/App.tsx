import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import Game from './components/Game';
import GameOver from './components/GameOver';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game-over" element={<GameOver />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;