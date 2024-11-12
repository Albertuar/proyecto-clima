import { useEffect, useState } from "react";
import Inputs from "./components/Inputs";
import TopButtons from "./components/TopButtons";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast, { ForecastData } from "./components/Forecast";
import getFormattedWeatherData from "./services/weatherService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WeatherModal from "./components/WeatherModal";


interface Query {
  q?: string;
  lat?: number;
  lon?: number;
}

interface DailyForecast {
  temp: number;
    temp_min: number;
    temp_max: number;
  title: string; 
  icon: string; 
  date: string; 
  details?: string; // Que se ven reflejadas aqui para mostrarlas
  humidity?: number; 
  windSpeed?: number;
  sunrise?: string;
    sunset?: string; 
}

interface WeatherData {
  name: string;
  country: string;
  temp: number;
  hourly: Array<{
    temp: number;
    title: string;
    icon: string;
    date: string;
  }>;
  daily: DailyForecast[];
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const App = () => {
  const [query, setQuery] = useState<Query>({ q: "London" });
  const [units, setUnits] = useState<string>("metric");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedDay, setSelectedDay] = useState<DailyForecast | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getWeather = async () => {
    const cityName = query.q ? query.q : "ubicación actual";
    toast.info(`Cargando clima para ${capitalizeFirstLetter(cityName)}`);
    try {
      const data = await getFormattedWeatherData({ ...query, units });
      setWeather(data);
      toast.success(`Clima obtenido para ${data.name}, ${data.country}`);
    } catch (error) {
      toast.error("Error al obtener el clima.");
    }
  };

  const handleOpenModal = (day: DailyForecast) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
    setIsModalOpen(false);
  };

  const navigateDay = (direction: "previous" | "next") => {
    if (!weather || !selectedDay) return;

    const currentIndex = weather.daily.findIndex(day => day === selectedDay);
    const newIndex = direction === "previous" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < weather.daily.length) {
      setSelectedDay(weather.daily[newIndex]);
    }
  };

  useEffect(() => {
    getWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-600 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    return weather.temp <= threshold ? "from-cyan-600 to-blue-700" : "from-yellow-600 to-orange-700";
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${formatBackground()} shadow-xl shadow-gray-400`}>
      <div className="mx-auto max-w-screen-lg mt-4 py-5 px-4 sm:px-8 md:px-12 lg:px-32 flex-grow">
        <TopButtons setQuery={setQuery} />
        <Inputs setQuery={setQuery} setUnits={setUnits} />

        {weather && (
          <>
            <TimeAndLocation weather={weather} />
            <TempAndDetails weather={weather} units={units} />
            <Forecast title="Previsión cada 3 horas" data={weather.hourly} />
            <Forecast
              title="Previsión semanal"
              data={weather.daily}
              onSelectDay={handleOpenModal}
            />
            <WeatherModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              selectedDay={selectedDay}
              navigateDay={navigateDay}
              formatBackground={formatBackground}
              isFirstDay={selectedDay ? weather.daily.indexOf(selectedDay) === 0 : true}
              isLastDay={selectedDay ? weather.daily.indexOf(selectedDay) === weather.daily.length - 1 : true}
            />
          </>
        )}
      </div>
      <ToastContainer position="top-left" autoClose={2500} hideProgressBar={true} theme="colored" draggable="mouse" stacked limit={2} />
    </div>
  );
};

export default App;

