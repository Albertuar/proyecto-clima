import { useState } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

interface InputsProps {
  setQuery: (query: { q?: string; lat?: number; lon?: number }) => void;
  setUnits: (units: string) => void;
}

const cities = [
 "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Bilbao", "Malaga", "Granada", "Alicante", "San Sebastián", 
"Paris", "London", "New York", "Tokyo", "Beijing", "Los Angeles", "Mexico City", "Sao Paulo", "Buenos Aires", "Moscow", 
"Berlin", "Rome", "Toronto", "Vancouver", "Sydney", "Melbourne", "Cairo", "Lagos", "Johannesburg", "Mumbai", "Delhi", 
"Istanbul", "Bangkok", "Kuala Lumpur", "Jakarta", "Singapore", "Hong Kong", "Seoul", "Dubai", "Shanghai", "Rio de Janeiro", 
"Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", 
"San Francisco", "Indianapolis", "Columbus", "Fort Worth", "Charlotte", "Detroit", "El Paso", "Memphis", "Baltimore", 
"Boston", "Seattle", "Denver", "Nashville", "Milwaukee", "Portland", "Las Vegas", "Oklahoma City", "Albuquerque", "Tucson", 
"Fresno", "Sacramento", "Atlanta", "Kansas City", "Colorado Springs", "Miami", "Oakland", "Minneapolis", "Arlington", 
"Tampa", "Orlando", "Saint Petersburg", "Pittsburgh", "Cincinnati", "Newark", "Anchorage", "Honolulu", "Plano", "Glendale", 
"Irvine", "Reno", "Buffalo", "Lubbock", "Madison", "Chandler", "Scottsdale", "Norfolk", "Winston-Salem", "North Las Vegas", 
"Irvine", "Fremont", "Boise", "Richmond", "Spokane", "Yonkers", "Worcester", "Tempe", "Oxnard", "Huntington Beach", "Glendale",
"Santa Clarita", "Garden Grove", "Santa Rosa", "Springfield", "Pasadena", "Macon", "Corona", "Cary", "Fort Collins", "Hayward",
"Sunnyvale", "Escondido", "Lakewood", "Clarksville", "Pomona", "Salinas", "Joliet", "Murfreesboro", "West Valley City",
];

const Inputs: React.FC<InputsProps> = ({ setQuery, setUnits }) => {
  const [city, setCity] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearchClick = () => {
    if (city !== "") setQuery({ q: city });
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setQuery({ lat: latitude, lon: longitude });
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setCity(value);
    if (value) {
      const filteredSuggestions = cities.filter(cityName =>
        cityName.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion);
    setSuggestions([]);
    setQuery({ q: suggestion });
  };

  return (
    <div className="flex flex-col md:flex-row justify-center my-6 space-y-4 md:space-y-0">
      <div className="relative flex flex-row w-full md:w-3/4 items-center justify-center space-x-4">
        <input
          value={city}
          onChange={handleInputChange} 
          type="text"
          placeholder="Especifique la ciudad..."
          className="text-gray-800 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none placeholder:text-gray-500"
        />
        <BiSearch 
          size={30} 
          className="cursor-pointer text-white transition ease-out hover:scale-125"
          onClick={handleSearchClick}
        />
        <BiCurrentLocation 
          size={30} 
          className="cursor-pointer text-white transition ease-out hover:scale-125"
          onClick={handleLocationClick}
        />
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white shadow-lg max-h-60 overflow-y-auto border border-gray-200">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 text-gray-800"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
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
}

export default Inputs;