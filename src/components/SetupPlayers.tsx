import React, { useState } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';

interface SetupPlayersProps {
  onPlayersSubmit: (players: string[]) => void;
}

const SetupPlayers: React.FC<SetupPlayersProps> = ({ onPlayersSubmit }) => {
  const [players, setPlayers] = useState<string[]>(['', '']);

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleAddPlayer = () => {
    setPlayers([...players, '']);
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPlayers = players.filter(player => player.trim() !== '');
    if (validPlayers.length >= 2) {
      onPlayersSubmit(validPlayers);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <UserPlus className="mr-2" /> Setup Players
      </h2>
      <form onSubmit={handleSubmit}>
        {players.map((player, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={player}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
              placeholder={`Player ${index + 1}`}
              className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {players.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemovePlayer(index)}
                className="bg-red-500 text-white px-3 py-2 rounded-r hover:bg-red-600 transition-colors"
              >
                <UserMinus size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddPlayer}
          className="w-full bg-green-500 text-white px-4 py-2 rounded mb-2 hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <UserPlus className="mr-2" /> Add Player
        </button>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default SetupPlayers;