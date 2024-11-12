import React, { useState } from 'react';
import { BiXCircle } from "react-icons/bi";
import { City } from './TopButtons'; 

interface SidebarProps {
  favoriteCities: City[];
  onSelectCity: (cityName: string) => void;
  onRemoveCity: (id: number) => void;
  onAddCity: (cityName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ favoriteCities, onSelectCity, onRemoveCity, onAddCity, isOpen, onClose }) => {
  const [cityInput, setCityInput] = useState('');

  const handleAddCity = () => {
    if (cityInput.trim()) {
      onAddCity(cityInput);
      setCityInput('');
    }
  };

  return (
    <div
    className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-br from-cyan-600 to-blue-700 text-white z-50 transform transition-transform duration-300 rounded-l-lg shadow-lg ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Favoritos</h2>
        <BiXCircle size={24} className="cursor-pointer" onClick={onClose} />
      </div>

      <div className="p-4 space-y-4">
        {/* Input para añadir una ciudad */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Añadir Ciudad"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="text-gray-800 px-4 py-2 rounded-md border border-gray-300 focus:outline-none w-full"
          />
          <button
            onClick={handleAddCity}
            className="text-base font-medium text-white px-4 py-2 rounded-md transition ease-in hover:scale-125"
          >
            Añadir
          </button>
        </div>

        {/* Lista de ciudades favoritas */}
        {favoriteCities.map(city => (
          <div key={city.id} className="flex items-center justify-between">
            <button
              onClick={() => onSelectCity(city.name)}
              className="text-white hover:bg-gray-700/20 px-4 py-2 rounded-md transition"
            >
              {city.name}
            </button>
            <BiXCircle
              size={20}
              className="cursor-pointer text-white"
              onClick={() => onRemoveCity(city.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
