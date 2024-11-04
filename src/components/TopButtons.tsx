

import React from 'react';

interface City {
  id: number;
  name: string;
}

interface TopButtonsProps {
  setQuery: (query: { q: string }) => void;
}

const TopButtons: React.FC<TopButtonsProps> = ({ setQuery }) => {
  const cities: City[] = [
    { id: 1, name: 'London' },
    { id: 2, name: 'Sydney' },
    { id: 3, name: 'Tokyo' },
    { id: 4, name: 'Paris' },
    { id: 5, name: 'Toronto' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center my-6 space-x-4">
      {cities.map(city => (
        <button
          key={city.id}
          className="text-base sm:text-lg font-medium hover:bg-gray-700/20 px-4 py-2 rounded-md transition ease-in"
          onClick={() => setQuery({ q: city.name })}
        >
          {city.name}
        </button>
      ))}
    </div>
  );
};

export default TopButtons;

