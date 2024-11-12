import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

interface City {
  id: number;
  name: string;
}

interface TopButtonsProps {
  setQuery: (query: { q: string }) => void;
}

const TopButtons: React.FC<TopButtonsProps> = ({ setQuery }) => {
  const [favoriteCities, setFavoriteCities] = useState<City[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedCities = localStorage.getItem('favoriteCities');
    if (storedCities) {
      setFavoriteCities(JSON.parse(storedCities));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  const addCityToFavorites = (cityName: string) => {
    if (cityName.trim() && !favoriteCities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
      const newCity: City = { id: Date.now(), name: cityName };
      setFavoriteCities([...favoriteCities, newCity]);
    }
  };

  const removeCityFromFavorites = (id: number) => {
    setFavoriteCities(favoriteCities.filter(city => city.id !== id));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col items-center my-6 space-y-4">
      {/* Botón para abrir el Sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-base font-medium text-white px-4 py-2 rounded-md transition ease-in hover:scale-125"
      >
        Ver Favoritos
      </button>

      {/* Sidebar */}
      <Sidebar
        favoriteCities={favoriteCities}
        onSelectCity={(cityName) => setQuery({ q: cityName })}
        onRemoveCity={removeCityFromFavorites}
        onAddCity={addCityToFavorites} // Pasa la función de agregar ciudad desde Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
      />
    </div>
  );
};

export default TopButtons;
