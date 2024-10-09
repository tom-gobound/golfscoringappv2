import React, { useState } from 'react';
import { Flag } from 'lucide-react';

interface SetupCourseProps {
  onCourseSubmit: (course: { par: number }[]) => void;
}

const SetupCourse: React.FC<SetupCourseProps> = ({ onCourseSubmit }) => {
  const [holes, setHoles] = useState(18);
  const [pars, setPars] = useState<number[]>(Array(18).fill(4));

  const handleParChange = (index: number, value: number) => {
    const newPars = [...pars];
    newPars[index] = value;
    setPars(newPars);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const course = pars.slice(0, holes).map(par => ({ par }));
    onCourseSubmit(course);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Flag className="mr-2" /> Setup Course
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="holes" className="block mb-2">
            Number of Holes:
          </label>
          <input
            type="number"
            id="holes"
            value={holes}
            onChange={(e) => setHoles(Number(e.target.value))}
            min="1"
            max="18"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Array.from({ length: holes }).map((_, index) => (
            <div key={index} className="flex items-center">
              <label htmlFor={`par-${index + 1}`} className="mr-2 w-16">
                Hole {index + 1}:
              </label>
              <input
                type="number"
                id={`par-${index + 1}`}
                value={pars[index]}
                onChange={(e) => handleParChange(index, Number(e.target.value))}
                min="3"
                max="5"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>
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

export default SetupCourse;