import React, { useState, useRef } from 'react';
import { Trophy, Edit, Flag } from 'lucide-react';
import { useFloating, useInteractions, useHover, offset, shift, flip, arrow } from '@floating-ui/react';

interface LeaderboardProps {
  players: string[];
  scores: { [player: string]: number[] };
  course: { par: number }[];
  onEditScores: (holeNumber: number) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, scores, course, onEditScores }) => {
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const playerRefs = useRef<{ [player: string]: HTMLTableRowElement | null }>({});

  const { refs, floatingStyles, context } = useFloating({
    open: !!hoveredPlayer,
    onOpenChange: (open) => {
      if (!open) setHoveredPlayer(null);
    },
    middleware: [
      offset(10),
      flip(),
      shift(),
      arrow({ element: arrowElement }),
    ],
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const calculateTotalScore = (playerScores: number[]) => {
    return playerScores.reduce((total, score) => total + (score || 0), 0);
  };

  const calculateTotalPar = () => {
    return course.reduce((total, hole) => total + hole.par, 0);
  };

  const getHolesPlayed = (playerScores: number[]) => {
    return playerScores.filter(score => score !== undefined).length;
  };

  const calculateSkins = () => {
    const skins: { [hole: number]: { player: string; count: number } } = {};
    let carryOver = 0;

    for (let hole = 0; hole < course.length; hole++) {
      const holeScores = players.map(player => ({
        player,
        score: scores[player]?.[hole] ?? Infinity
      }));

      const lowestScore = Math.min(...holeScores.map(s => s.score));
      const lowestScorers = holeScores.filter(s => s.score === lowestScore);

      if (lowestScorers.length === 1) {
        skins[hole + 1] = {
          player: lowestScorers[0].player,
          count: carryOver + 1
        };
        carryOver = 0;
      } else {
        carryOver++;
      }
    }

    return skins;
  };

  const skins = calculateSkins();

  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = calculateTotalScore(scores[a] || []);
    const scoreB = calculateTotalScore(scores[b] || []);
    return scoreA - scoreB;
  });

  const totalPar = calculateTotalPar();

  const isHoleScored = (holeIndex: number) => {
    return players.some(player => scores[player][holeIndex] !== undefined);
  };

  const getScoreStyle = (score: number, par: number) => {
    if (score < par) return 'bg-red-100 text-red-700';
    if (score > par) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getTotalSkins = (player: string) => {
    return Object.values(skins).reduce((total, skin) => {
      if (skin.player === player) {
        return total + skin.count;
      }
      return total;
    }, 0);
  };

  const hasBeagle = (playerScores: number[]) => {
    for (let i = 0; i < playerScores.length - 2; i++) {
      const threeHoles = playerScores.slice(i, i + 3);
      const eagleCount = threeHoles.filter((score, index) => score <= course[i + index].par - 2).length;
      const birdieCount = threeHoles.filter((score, index) => score === course[i + index].par - 1).length;
      if (eagleCount >= 1 && birdieCount >= 2) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Trophy className="mr-2" /> Current Standings
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th className="text-left">Pos</th>
              <th className="text-left">Player</th>
              <th className="text-right">Score</th>
              <th className="text-right">To Par</th>
              <th className="text-right">Thru</th>
              <th className="text-right">Skins</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => {
              const totalScore = calculateTotalScore(scores[player] || []);
              const holesPlayed = getHolesPlayed(scores[player] || []);
              const parForPlayedHoles = course.slice(0, holesPlayed).reduce((total, hole) => total + hole.par, 0);
              const toPar = totalScore - parForPlayedHoles;
              const totalSkins = getTotalSkins(player);
              return (
                <tr
                  key={player}
                  ref={(el) => playerRefs.current[player] = el}
                  className={`${index === 0 ? "font-bold" : ""} hover:bg-gray-100 transition-colors`}
                  onMouseEnter={() => {
                    setHoveredPlayer(player);
                    refs.setPositionReference(playerRefs.current[player]);
                  }}
                  onMouseLeave={() => setHoveredPlayer(null)}
                  {...getReferenceProps()}
                >
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2 flex items-center">
                    {player}
                    {hasBeagle(scores[player] || []) && (
                      <span className="ml-2" role="img" aria-label="beagle">
                        🐶
                      </span>
                    )}
                  </td>
                  <td className="text-right py-2">{totalScore}</td>
                  <td className={`text-right py-2 ${toPar <= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    {toPar === 0 ? "E" : toPar > 0 ? `+${toPar}` : toPar}
                  </td>
                  <td className="text-right py-2">{holesPlayed}</td>
                  <td className="text-right py-2">{totalSkins}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hoveredPlayer && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg z-10"
        >
          <h3 className="text-xl font-bold mb-3 flex items-center">
            <Flag className="mr-2" /> {hoveredPlayer}'s Scorecard
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-center text-xs font-semibold p-1 border-b">Hole</th>
                  {course.map((_, index) => (
                    <th key={index} className="text-center text-xs font-semibold p-1 border-b">{index + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center text-xs font-semibold p-1">Par</td>
                  {course.map((hole, index) => (
                    <td key={index} className="text-center text-xs p-1">{hole.par}</td>
                  ))}
                </tr>
                <tr>
                  <td className="text-center text-xs font-semibold p-1">Score</td>
                  {course.map((hole, index) => {
                    const score = scores[hoveredPlayer][index];
                    const skinWon = skins[index + 1]?.player === hoveredPlayer ? skins[index + 1].count : 0;
                    return (
                      <td key={index} className="p-1">
                        {score !== undefined ? (
                          <div className={`flex justify-center items-center w-6 h-6 rounded text-xs font-medium ${getScoreStyle(score, hole.par)}`}>
                            {score}
                            {skinWon > 0 && <sup className="text-[8px] ml-0.5">{skinWon}</sup>}
                          </div>
                        ) : '-'}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {course.map((_, index) => (
          <button
            key={index}
            onClick={() => onEditScores(index + 1)}
            className={`flex items-center justify-center px-2 py-1 rounded ${
              isHoleScored(index) ? 'bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'
            } hover:bg-opacity-80 transition-colors whitespace-nowrap`}
          >
            <Edit className="w-4 h-4 mr-1" />
            Hole {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;