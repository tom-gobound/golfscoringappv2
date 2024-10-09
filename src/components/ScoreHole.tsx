import React, { useState, useEffect } from 'react';
import { Flag } from 'lucide-react';

interface ScoreHoleProps {
  players: string[];
  holeNumber: number;
  course: { par: number }[];
  onScoreSubmit: (scores: { [player: string]: number }) => void;
}

const ScoreHole: React.FC<ScoreHoleProps> = ({ players, holeNumber, course, onScoreSubmit }) => {
  const [scores, setScores] = useState<{ [player: string]: string }>(
    players.reduce((acc, player) => ({ ...acc, [player]: '' }), {})
  );

  useEffect(() => {
    // Reset scores when moving to a new hole
    setScores(players.reduce((acc, player) => ({ ...acc, [player]: '' }), {}));
  }, [holeNumber, players]);

  const handleScoreChange = (player: string, score: string) => {
    setScores({ ...scores, [player]: score });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validScores = Object.entries(scores).reduce((acc, [player, score]) => {
      const numScore = parseInt(score);
      if (!isNaN(numScore) && numScore > 0) {
        acc[player] = numScore;
      }
      return acc;
    }, {} as { [player: string]: number });

    if (Object.keys(validScores).length === players.length) {
      onScoreSubmit(validScores);
    } else {
      alert("Please enter valid scores for all players.");
    }
  };

  const currentHole = course[holeNumber - 1];
  const par = currentHole?.par ?? 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Flag className="mr-2" /> Hole {holeNumber} {par > 0 && `(Par ${par})`}
      </h2>
      <form onSubmit={handleSubmit}>
        {players.map((player) => (
          <div key={player} className="mb-4">
            <label htmlFor={`score-${player}`} className="block mb-2">
              {player}'s score:
            </label>
            <input
              type="number"
              id={`score-${player}`}
              value={scores[player]}
              onChange={(e) => handleScoreChange(player, e.target.value)}
              min="1"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Submit Scores
        </button>
      </form>
    </div>
  );
};

export default ScoreHole;