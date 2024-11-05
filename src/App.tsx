import { useEffect, useState } from "react";
import Inputs from "./components/Inputs";
import TopButtons from "./components/TopButtons";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast, { ForecastData } from "./components/Forecast";
import getFormattedWeatherData from "./services/weatherService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { BiXCircle } from "react-icons/bi";

interface Query {
  q?: string;
  lat?: number;
  lon?: number;
}

interface DailyForecast {
  temp: {
    day: number; 
    night: number; 
  };
  title: string; 
  icon: string; 
  date: string; 
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
  const [weekleyForecast, setWeeklyForecast] = useState<ForecastData | null>(null);
  const [selectedDay, setSelectedDay] = useState< null>(null);


  const getWeather = async () => {
    const cityName = query.q ? query.q : "current location";
    toast.info(`Clima en ${capitalizeFirstLetter(cityName)}`);
  
    try {
      const data = await getFormattedWeatherData({ ...query, units });
      toast.success(`Datos meteorológicos obtenidos ${data.name}, ${data.country}`);
      
      // Establece los datos meteorológicos generales
      setWeather(data);
  
      // Usa selectedDay para obtener y mostrar los datos del día seleccionado
      const dayData = selectedDay || data.daily[0];  // Si selectedDay no está definido, usa el primer día como predeterminado
      console.log("Datos del día seleccionado:", dayData);
  
      setSelectedDay(dayData);  // Asegura que selectedDay se mantenga actualizado
  
    } catch (error) {
      toast.error("Error al obtener los datos meteorológicos.");
      console.error(error);
    }
  };

  const handleSelectDay = (day: ForecastData) => {
    setSelectedDay(day);
    console.log("Día seleccionado:", day);
  };
  
  useEffect(() => {
    getWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return 'from-cyan-600 to-blue-700';
    const threshold = units === 'metric' ? 20 : 60;
    return weather.temp <= threshold ? 'from-cyan-600 to-blue-700' : 'from-yellow-600 to-orange-700';
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
            <Forecast title='Previsión cada 3 horas' data={weather.hourly} />
            <Forecast 
              title="Previsión semanal"
              data={weather.daily}
              onSelectDay={handleSelectDay}
            />
            <Modal 
              className={`h-auto md:h-[80vh] w-full md:w-[80%] lg:w-[60%] flex flex-col bg-gradient-to-br ${formatBackground()} bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 rounded-lg p-4 mx-auto backdrop-blur-sm`}
              isOpen={selectedDay !== null}
              onRequestClose={() => setSelectedDay(null)}
              //style={customStyles}//
              contentLabel="Example Modal">
             <BiXCircle 
          size={30} 
          className="cursor-pointer text-white transition ease-out hover:scale-125"
          onClick={() => setSelectedDay(null)}/>
            </Modal>
          </>
        )}
      </div>
      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored" />
    </div>
  );
};

export default App;
