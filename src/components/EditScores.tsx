import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface EditScoresProps {
  players: string[];
  holeNumber: number;
  currentScores: { [player: string]: number };
  onUpdateScores: (scores: { [player: string]: number }) => void;
}

const EditScores: React.FC<EditScoresProps> = ({ players, holeNumber, currentScores, onUpdateScores }) => {
  const [scores, setScores] = useState<{ [player: string]: string }>(
    players.reduce((acc, player) => ({ ...acc, [player]: currentScores[player]?.toString() || '' }), {})
  );

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
      onUpdateScores(validScores);
    } else {
      alert("Please enter valid scores for all players.");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Save className="mr-2" /> Edit Scores for Hole {holeNumber}
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
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <Save className="mr-2" /> Update Scores
        </button>
      </form>
    </div>
  );
};

export default EditScores;