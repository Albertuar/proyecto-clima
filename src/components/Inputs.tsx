import React, { useState, useCallback } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

interface InputsProps {
  setQuery: (query: { q?: string; lat?: number; lon?: number }) => void;
  setUnits: (units: string) => void;
}

const cities = [
  "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Bilbao", "Malaga", "Granada", "Alicante", "San Sebastián",
  "Paris", "London", "New York", "Tokyo", "Beijing", "Los Angeles", "Mexico City", "Sao Paulo", "Buenos Aires", "Moscow",

];

const Inputs: React.FC<InputsProps> = ({ setQuery, setUnits }) => {
  const [city, setCity] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleSearchClick = useCallback(() => {
    if (city.trim()) {
      setQuery({ q: city });
      setSuggestions([]);
    }
  }, [city, setQuery]);

  const handleLocationClick = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setQuery({ lat: latitude, lon: longitude });
      });
    }
  }, [setQuery]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCity(value);

      if (value.trim()) {
        const filtered = cities.filter((cityName) =>
          cityName.toLowerCase().startsWith(value.toLowerCase())
        );
        setSuggestions(filtered);
        setHighlightedIndex(null);
      } else {
        setSuggestions([]);
      }
    },
    []
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setCity(suggestion);
      setSuggestions([]);
      setQuery({ q: suggestion });
    },
    [setQuery]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (suggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) =>
          prev === null || prev === suggestions.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) =>
          prev === null || prev === 0 ? suggestions.length - 1 : prev - 1
        );
      } else if (e.key === "Enter" && highlightedIndex !== null) {
        handleSuggestionClick(suggestions[highlightedIndex]);
      }
    },
    [suggestions, highlightedIndex, handleSuggestionClick]
  );

  return (
    <div className="flex flex-col md:flex-row justify-center my-6 space-y-4 md:space-y-0">
      <div className="relative flex flex-row w-full md:w-3/4 items-center justify-center space-x-4">
        <label htmlFor="city-input" className="sr-only">
          Buscar ciudad
        </label>
        <input
          id="city-input"
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Especifique la ciudad..."
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-expanded={suggestions.length > 0}
          aria-live="polite"
          className="text-gray-800 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none rounded-md border placeholder:text-gray-500"
        />
        <button
          aria-label="Buscar clima"
          className="cursor-pointer text-white transition ease-out hover:scale-125"
          onClick={handleSearchClick}
        >
          <BiSearch size={30} />
        </button>
        <button
          aria-label="Usar ubicación actual"
          className="cursor-pointer text-white transition ease-out hover:scale-125"
          onClick={handleLocationClick}
        >
          <BiCurrentLocation size={30} />
        </button>

        {suggestions.length > 0 && (
          <ul
            id="suggestions-list"
            role="listbox"
            className="absolute z-10 w-full bg-white shadow-lg max-h-60 overflow-y-auto border border-gray-200"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                role="option"
                aria-selected={highlightedIndex === index}
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
          aria-label="Cambiar a Celsius"
          className="text-xl font-medium transition ease-out hover:scale-125 text-white"
          onClick={() => setUnits("metric")}
        >
          ºC
        </button>
        <p className="text-2xl font-medium text-white">|</p>
        <button
          aria-label="Cambiar a Fahrenheit"
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
