import React, { useState, useCallback, useMemo } from "react";
import { BiXCircle, BiListPlus } from "react-icons/bi";
import { City } from "./TopButtons";

interface SidebarProps {
  favoriteCities: City[];
  onSelectCity: (cityName: string) => void;
  onRemoveCity: (id: number) => void;
  onAddCity: (cityName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  favoriteCities,
  onSelectCity,
  onRemoveCity,
  onAddCity,
  isOpen,
  onClose,
}) => {
  const [cityInput, setCityInput] = useState("");

  const handleAddCity = useCallback(() => {
    const trimmedCity = cityInput.trim();
    if (trimmedCity && !favoriteCities.some((city) => city.name === trimmedCity)) {
      onAddCity(trimmedCity);
      setCityInput("");
    }
  }, [cityInput, favoriteCities, onAddCity]);

  const favoriteCityItems = useMemo(
    () =>
      favoriteCities.map((city) => (
        <FavoriteCityItem
          key={city.id}
          city={city}
          onSelectCity={onSelectCity}
          onRemoveCity={onRemoveCity}
        />
      )),
    [favoriteCities, onSelectCity, onRemoveCity]
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-br from-cyan-600 to-blue-700 text-white z-50 transform transition-transform duration-300 rounded-l-lg shadow-lg ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Favoritos</h2>
        <BiXCircle
          size={24}
          className="cursor-pointer text-white transition ease-out hover:scale-125"
          onClick={onClose}
        />
      </div>

      {/* Contenido principal */}
      <div className="p-4 space-y-4">
        {/* Campo de entrada para agregar ciudad */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Añadir Ciudad"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="text-gray-800 px-4 py-2 rounded-md border border-gray-300 focus:outline-none w-full"
          />
          <BiListPlus
            size={28}
            className="cursor-pointer text-white transition-transform transform hover:scale-125"
            onClick={handleAddCity}
          />
        </div>

        {/* Lista de ciudades favoritas */}
        {favoriteCityItems}
      </div>
    </div>
  );
};

interface FavoriteCityItemProps {
  city: City;
  onSelectCity: (cityName: string) => void;
  onRemoveCity: (id: number) => void;
}

const FavoriteCityItem: React.FC<FavoriteCityItemProps> = React.memo(
  ({ city, onSelectCity, onRemoveCity }) => (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onSelectCity(city.name)}
        className="text-white hover:bg-gray-700/20 px-4 py-2 rounded-md transition"
      >
        {city.name}
      </button>
      <BiXCircle
        size={20}
        className="cursor-pointer text-white transition ease-out hover:scale-125"
        onClick={() => onRemoveCity(city.id)}
      />
    </div>
  )
);

export default Sidebar;
