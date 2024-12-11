import React, { useState, useCallback, useMemo } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

interface InputsProps {
  setQuery: (query: { q?: string; lat?: number; lon?: number }) => void;
  setUnits: (units: string) => void;
}

const cities = [
  // España
  "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Bilbao", "Málaga", "Granada", "Alicante",
  "San Sebastián", "Santander", "Oviedo", "Gijón", "Vigo", "A Coruña", "Santiago de Compostela",
  "Pamplona", "Logroño", "Burgos", "León", "Salamanca", "Valladolid", "Toledo", "Albacete",
  "Ciudad Real", "Cuenca", "Guadalajara", "Segovia", "Ávila", "Huesca", "Teruel", "Cáceres",
  "Badajoz", "Almería", "Cádiz", "Córdoba", "Huelva", "Jaén", "Las Palmas de Gran Canaria",
  "Santa Cruz de Tenerife", "Palma de Mallorca", "Lugo", "Ourense", "Zamora", "Soria",
  "Girona", "Tarragona", "Lleida", "Castellón", "Vitoria-Gasteiz", "Donostia-San Sebastián",
  "Murcia", "Ceuta", "Melilla",
  // Europa
  "Paris", "London", "Berlin", "Rome", "Amsterdam", "Lisbon", "Vienna", "Prague", "Dublin", "Stockholm",
  // América del Norte
  "New York", "Los Angeles", "Chicago", "Houston", "Miami", "Toronto", "Vancouver", "Mexico City",
  // América del Sur
  "Buenos Aires", "Sao Paulo", "Rio de Janeiro", "Lima", "Bogota", "Santiago", "Quito", "Montevideo", "Caracas",
  // Asia
  "Tokyo", "Beijing", "Seoul", "Bangkok", "Singapore", "Mumbai", "Shanghai", "Jakarta", "Kuala Lumpur", "Manila",
  // Oceanía
  "Sydney", "Melbourne", "Auckland", "Perth", "Brisbane", "Wellington",
  // África
  "Cape Town", "Johannesburg", "Nairobi", "Cairo", "Lagos", "Casablanca", "Addis Ababa", "Accra", "Algiers",
  // Oriente Medio
  "Dubai", "Riyadh", "Istanbul", "Jerusalem", "Tehran", "Doha", "Abu Dhabi"
];

const Inputs: React.FC<InputsProps> = ({ setQuery, setUnits }) => {
  const [city, setCity] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  // Generar sugerencias dinámicamente
  const suggestions = useMemo(() => {
    if (!city.trim()) return [];
    const lowerCaseCity = city.toLowerCase();
    return cities.filter((name) => name.toLowerCase().startsWith(lowerCaseCity));
  }, [city]);

  const handleSearchClick = useCallback(() => {
    if (city.trim()) {
      setQuery({ q: city });
    }
  }, [city, setQuery]);

  const handleLocationClick = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setQuery({ lat: coords.latitude, lon: coords.longitude });
      });
    }
  }, [setQuery]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    setHighlightedIndex(null); // Reinicia el índice al cambiar el valor
  }, []);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setCity(suggestion);
      setQuery({ q: suggestion });
    },
    [setQuery]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (highlightedIndex !== null && suggestions.length > 0) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          handleSearchClick();
        }
      } else if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) =>
          prev === null || prev === suggestions.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) =>
          prev === null || prev === 0 ? suggestions.length - 1 : prev - 1
        );
      }
    },
    [highlightedIndex, suggestions, handleSuggestionClick, handleSearchClick]
  );

  return (
    <div className="flex flex-col md:flex-row justify-center my-6 space-y-4 md:space-y-0">
      <div className="relative flex flex-row w-full md:w-3/4 items-center justify-center space-x-4">
        <input
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Especifique la ciudad..."
          className="text-gray-800 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none rounded-md border placeholder:text-gray-500"
        />
        <button
          className="cursor-pointer text-white transition ease-out hover:scale-125"
          onClick={handleSearchClick}
        >
          <BiSearch size={30} />
        </button>
        <button
          className="cursor-pointer text-white transition ease-out hover:scale-125"
          onClick={handleLocationClick}
        >
          <BiCurrentLocation size={30} />
        </button>

        {suggestions.length > 0 && (
          <ul
            className="absolute z-10 w-full bg-white shadow-lg max-h-60 overflow-y-auto border border-gray-200"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`p-2 cursor-pointer text-gray-800 ${
                  highlightedIndex === index ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-row w-full md:w-1/4 items-center justify-center space-x-2">
        <button
          className="text-xl font-medium transition ease-out hover:scale-125 text-white"
          onClick={() => setUnits("metric")}
        >
          ºC
        </button>
        <p className="text-2xl font-medium text-white">|</p>
        <button
          className="text-xl font-medium transition ease-out hover:scale-125 text-white"
          onClick={() => setUnits("imperial")}
        >
          ºF
        </button>
      </div>
    </div>
  );
};

export default React.memo(Inputs);