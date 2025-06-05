export interface Player {
  name: string;
  surname?: string;
  company?: string;
  email: string;
  score: number;
  level: number;
}

// Get leaderboard from local storage
export const getLeaderboard = (): Player[] => {
  const leaderboardData = localStorage.getItem('parcelCatcherLeaderboard');
  if (leaderboardData) {
    try {
      return JSON.parse(leaderboardData);
    } catch (e) {
      console.error('Error parsing leaderboard data', e);
      return [];
    }
  }
  return [];
};

// Clear leaderboard
export const clearLeaderboard = (): void => {
  localStorage.removeItem('parcelCatcherLeaderboard');
};

// Update leaderboard with new player score
export const updateLeaderboard = (player: Player): void => {
  const leaderboard = getLeaderboard();
  
  // Check if player already exists (by email)
  const existingPlayerIndex = leaderboard.findIndex(p => p.email === player.email);
  
  if (existingPlayerIndex !== -1) {
    // Update score only if new score is higher
    if (player.score > leaderboard[existingPlayerIndex].score) {
      leaderboard[existingPlayerIndex] = player;
    }
  } else {
    // Add new player
    leaderboard.push(player);
  }
  
  // Sort by score (highest first)
  leaderboard.sort((a, b) => b.score - a.score);
  
  // Keep only top 10 scores
  const topScores = leaderboard.slice(0, 10);
  
  // Save to local storage
  localStorage.setItem('parcelCatcherLeaderboard', JSON.stringify(topScores));
};