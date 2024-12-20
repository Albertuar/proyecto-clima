import { useEffect, useState, useCallback, useMemo } from "react";
import Inputs from "./components/Inputs";
import TopButtons from "./components/TopButtons";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData from "./services/weatherService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  details?: string;
  humidity?: number;
  windSpeed?: number;
  sunrise?: string;
  sunset?: string;
}

interface WeatherData {
  name: string;
  country: string;
  temp: number;
  formattedLocalTime: string;
  hourly: Array<{
    temp: number;
    title: string;
    icon: string;
    date: string;
  }>;
  daily: DailyForecast[];
}

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const App = () => {
  const [query, setQuery] = useState<Query>({ q: "London" });
  const [units, setUnits] = useState<string>("metric");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedDay, setSelectedDay] = useState<DailyForecast | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getWeather = useCallback(async () => {
    const cityName = query.q ? query.q : "ubicación actual";
    toast.info(`Cargando clima para ${capitalizeFirstLetter(cityName)}`);
    try {
      const data = await getFormattedWeatherData({ ...query, units });
      setWeather(data);
      toast.success(`Clima obtenido para ${data.name}, ${data.country}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error al obtener el clima.");
    }
  }, [query, units]);

  const handleOpenModal = useCallback((day: DailyForecast) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDay(null);
    setIsModalOpen(false);
  }, []);

  const navigateDay = useCallback(
    (direction: "previous" | "next") => {
      if (!weather || !selectedDay) return;

      const currentIndex = weather.daily.findIndex(day => day === selectedDay);
      const newIndex =
        direction === "previous" ? currentIndex - 1 : currentIndex + 1;

      if (newIndex >= 0 && newIndex < weather.daily.length) {
        setSelectedDay(weather.daily[newIndex]);
      }
    },
    [weather, selectedDay]
  );

  useEffect(() => {
    getWeather();
  }, [query, units, getWeather]);

  const location = useMemo(
    () => `${weather?.name || ""}, ${weather?.country || ""}`,
    [weather]
  );

  const formattedLocalTime = useMemo(
    () => weather?.formattedLocalTime || "",
    [weather]
  );

  const dailyIcons = useMemo(() => {
    return weather?.daily.map((day) => ({
      ...day,
      iconUrl: `https://openweathermap.org/img/wn/${day.icon}@2x.png`,
    }));
  }, [weather?.daily]);

  const backgroundClass = useMemo(() => {
    if (!weather) return "from-cyan-600 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    return weather.temp <= threshold
      ? "from-cyan-600 to-blue-700"
      : "from-yellow-600 to-orange-700";
  }, [weather, units]);

  const handleSelectHourlyDay = useCallback(() => {
    // Handle the selection of an hourly day if needed
  }, []);

  return (
    <div
      className={`flex flex-col bg-gradient-to-br ${backgroundClass} shadow-xl shadow-gray-400`}
      role="main"
      aria-live="polite"
    >
      <div className="mx-auto max-w-screen-lg mt-4 py-5 px-4 sm:px-8 md:px-12 lg:px-32 flex flex-col min-h-full">
        <TopButtons setQuery={setQuery} aria-label="Botones principales de búsqueda" />
        <Inputs setQuery={setQuery} setUnits={setUnits} aria-label="Entrar ubicación y unidades" />

        {weather && (
          <>
            <TimeAndLocation
              weather={{
                formattedLocalTime,
                location,
              }}
            />
            <TempAndDetails weather={weather} units={units} aria-live="polite" />
            <Forecast
              title="Previsión cada 3 horas"
              data={weather.hourly}
              onSelectDay={handleSelectHourlyDay}
              aria-label="Previsión por horas"
            />
            <Forecast
              title="Previsión semanal"
              data={dailyIcons}
              onSelectDay={handleOpenModal}
              aria-label="Previsión semanal"
            />
            <WeatherModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              selectedDay={selectedDay}
              hourlyData={weather.hourly}
              navigateDay={navigateDay}
              formatBackground={backgroundClass}
              isFirstDay={selectedDay ? weather.daily.indexOf(selectedDay) === 0 : true}
              isLastDay={selectedDay ? weather.daily.indexOf(selectedDay) === weather.daily.length - 1 : true}
              name={weather.name}
              country={weather.country}
            />
          </>
        )}
      </div>
      <ToastContainer
        position="top-left"
        autoClose={2500}
        hideProgressBar={true}
        theme="colored"
        draggable="mouse"
        stacked
        limit={2}
        aria-live="assertive"
      />
    </div>
  );
};

export default App;
