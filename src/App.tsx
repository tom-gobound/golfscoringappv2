import React, { useState } from 'react';
import SetupPlayers from './components/SetupPlayers';
import SetupCourse from './components/SetupCourse';
import ScoreEntry from './components/ScoreEntry';
import Leaderboard from './components/Leaderboard';
import EditScores from './components/EditScores';
import { Users, Flag, PenTool, Trophy, Edit } from 'lucide-react';

const App: React.FC = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [course, setCourse] = useState<{ par: number }[]>([]);
  const [scores, setScores] = useState<{ [player: string]: number[] }>({});
  const [currentHole, setCurrentHole] = useState(1);
  const [screen, setScreen] = useState<'setupPlayers' | 'setupCourse' | 'scoreEntry' | 'leaderboard' | 'editScores'>('setupPlayers');
  const [editingHole, setEditingHole] = useState<number | null>(null);

  const handlePlayersSubmit = (submittedPlayers: string[]) => {
    setPlayers(submittedPlayers);
    setScreen('setupCourse');
  };

  const handleCourseSubmit = (submittedCourse: { par: number }[]) => {
    setCourse(submittedCourse);
    setScreen('scoreEntry');
  };

  const handleScoreSubmit = (holeScores: { [player: string]: number }) => {
    const newScores = { ...scores };
    players.forEach(player => {
      if (!newScores[player]) {
        newScores[player] = [];
      }
      newScores[player][currentHole - 1] = holeScores[player];
    });
    setScores(newScores);
    setScreen('leaderboard');
  };

  const handleEditScores = (holeNumber: number) => {
    setEditingHole(holeNumber);
    setScreen('editScores');
  };

  const handleUpdateScores = (updatedScores: { [player: string]: number }) => {
    const newScores = { ...scores };
    players.forEach(player => {
      newScores[player][editingHole! - 1] = updatedScores[player];
    });
    setScores(newScores);
    setEditingHole(null);
    setScreen('leaderboard');
  };

  const getFirstUnscoredHole = () => {
    for (let i = 0; i < course.length; i++) {
      if (!players.every(player => scores[player]?.[i] !== undefined)) {
        return i + 1;
      }
    }
    return course.length;
  };

  const handleEnterScores = () => {
    const nextHole = getFirstUnscoredHole();
    setCurrentHole(nextHole);
    setScreen('scoreEntry');
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Golf Scoring App v2</h1>
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        {screen === 'setupPlayers' && (
          <SetupPlayers onPlayersSubmit={handlePlayersSubmit} />
        )}
        {screen === 'setupCourse' && (
          <SetupCourse onCourseSubmit={handleCourseSubmit} />
        )}
        {screen === 'scoreEntry' && (
          <ScoreEntry
            players={players}
            holeNumber={currentHole}
            course={course}
            onScoreSubmit={handleScoreSubmit}
          />
        )}
        {screen === 'leaderboard' && (
          <Leaderboard
            players={players}
            scores={scores}
            course={course}
            onEditScores={handleEditScores}
          />
        )}
        {screen === 'editScores' && editingHole !== null && (
          <EditScores
            players={players}
            holeNumber={editingHole}
            currentScores={players.reduce((acc, player) => ({
              ...acc,
              [player]: scores[player][editingHole - 1]
            }), {})}
            onUpdateScores={handleUpdateScores}
          />
        )}
      </div>
      {screen === 'leaderboard' && (
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={handleEnterScores}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
          >
            <PenTool className="mr-2" /> Enter Scores
          </button>
        </div>
      )}
    </div>
  );
};

export default App;