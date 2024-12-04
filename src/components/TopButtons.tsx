import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./Sidebar";
import { BiListUl } from "react-icons/bi";

export interface City {
  id: number;
  name: string;
}

interface TopButtonsProps {
  setQuery: (query: { q: string }) => void;
}

const TopButtons: React.FC<TopButtonsProps> = ({ setQuery }) => {
  const [favoriteCities, setFavoriteCities] = useState<City[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Cargar favoritos desde localStorage
  useEffect(() => {
    const storedCities = localStorage.getItem("favoriteCities");
    if (storedCities) {
      setFavoriteCities(JSON.parse(storedCities));
    }
  }, []);

  // Guardar favoritos en localStorage
  useEffect(() => {
    localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  // Agregar ciudad a favoritos
  const addCityToFavorites = useCallback(
    (cityName: string) => {
      const trimmedCity = cityName.trim();
      if (
        trimmedCity &&
        !favoriteCities.some(
          (city) => city.name.toLowerCase() === trimmedCity.toLowerCase()
        )
      ) {
        const newCity: City = { id: Date.now(), name: trimmedCity };
        setFavoriteCities((prevCities) => [...prevCities, newCity]);
      }
    },
    [favoriteCities]
  );

  // Eliminar ciudad de favoritos
  const removeCityFromFavorites = useCallback(
    (id: number) => {
      setFavoriteCities((prevCities) =>
        prevCities.filter((city) => city.id !== id)
      );
    },
    []
  );

  // Alternar visibilidad del Sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prevState) => !prevState);
  }, []);

  // Manejo de cierre con tecla "Escape"
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    },
    [isSidebarOpen]
  );

  // Enfocar el Sidebar al abrirlo
  useEffect(() => {
    if (isSidebarOpen) {
      sidebarRef.current?.focus();
    }
  }, [isSidebarOpen]);

  return (
    <div className="relative flex items-center gap-2 p-2">
      {/* Botón para abrir/cerrar el Sidebar */}
      <button
        className="flex items-center gap-2 text-white hover:scale-105 transition ease-out"
        onClick={toggleSidebar}
        aria-expanded={isSidebarOpen}
        aria-controls="favorites-sidebar"
        aria-label="Abrir lista de ciudades favoritas"
      >
        <BiListUl size={28} />
        <span className="text-sm font-medium sm:inline">Favoritos</span>
      </button>

      {/* Sidebar */}
      <Sidebar
        favoriteCities={favoriteCities}
        onSelectCity={(cityName) => setQuery({ q: cityName })}
        onRemoveCity={removeCityFromFavorites}
        onAddCity={addCityToFavorites}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
      />

      {/* Contenedor invisible para accesibilidad (cerrar con teclado) */}
      {isSidebarOpen && (
        <div
          id="favorites-sidebar"
          ref={sidebarRef}
          tabIndex={-1}
          role="dialog"
          aria-label="Lista de ciudades favoritas"
          className="absolute inset-0 focus:outline-none"
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};

export default React.memo(TopButtons);
