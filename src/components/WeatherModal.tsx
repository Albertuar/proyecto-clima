import React from "react";
import { BiSolidDropletHalf } from "react-icons/bi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { BiXCircle } from "react-icons/bi";

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

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: DailyForecast | null;
  hourlyData: Array<{ temp: number; title: string; icon: string; date: string }>;
  navigateDay: (direction: "previous" | "next") => void;
  formatBackground: () => string;
  isFirstDay: boolean;
  isLastDay: boolean;
  name: string;
  country: string;
}

const WeatherModal: React.FC<WeatherModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  hourlyData,
  navigateDay,
  isFirstDay,
  isLastDay,
  name,
  country,
}) => {
  if (!isOpen || !selectedDay) return null;

  const selectedDayDate = selectedDay.date.slice(0, 10); // Formato "YYYY-MM-DD"
  const filteredHourlyData = hourlyData.filter((hour) =>
    hour.date.startsWith(selectedDayDate)
  );

  const formatToLocalTime = (timeString: string | undefined): string => {
    if (!timeString) return "N/A";
    const date = new Date(timeString);
    return isNaN(date.getTime())
      ? "Información no disponible"
      : date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateForButton = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Sin fecha";
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    return new Intl.DateTimeFormat("es-ES", options).format(date);
  };

  const previousDayLabel = isFirstDay
    ? ""
    : formatDateForButton(
        new Date(new Date(selectedDay.date).setDate(new Date(selectedDay.date).getDate() - 1)).toISOString()
      );

  const nextDayLabel = isLastDay
    ? ""
    : formatDateForButton(
        new Date(new Date(selectedDay.date).setDate(new Date(selectedDay.date).getDate() + 1)).toISOString()
      );

  const formatDateForTitle = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha no válida";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    return new Intl.DateTimeFormat("es-ES", options).format(date);
  };

  const isCold = selectedDay.temp <= 20;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      aria-hidden={!isOpen}
      role="dialog"
      aria-labelledby="weather-modal-title"
      aria-describedby="weather-modal-description"
    >
      <div
        className={`rounded-lg p-6 max-w-md w-full text-white shadow-lg bg-gradient-to-br ${
          isCold ? "from-cyan-600 to-blue-700" : "from-yellow-600 to-orange-700"
        }`}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h2 id="weather-modal-title" className="text-2xl font-extrabold">
            {formatDateForTitle(selectedDay.date)}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="cursor-pointer text-white transition-transform hover:scale-125"
          >
            <BiXCircle size={28} />
          </button>
        </div>

        {/* Ubicación */}
        <div className="text-center mb-4">
          <p className="text-lg font-bold" id="weather-modal-description">
            {name}, {country}
          </p>
        </div>

        {/* Icono de Clima */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={selectedDay.icon}
            alt="Icono del clima"
            className="w-24 h-24 mb-2"
          />
          <p className="text-lg font-semibold">{selectedDay.details}</p>
          <p className="text-xl font-bold mt-1">{selectedDay.temp}°</p>
        </div>

        {/* Detalles del Clima */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex items-center">
            <MdKeyboardArrowUp className="mr-1 text-lg" />
            Máx: {selectedDay.temp_max}°
          </div>
          <div className="flex items-center">
            <MdKeyboardArrowDown className="mr-1 text-lg" />
            Mín: {selectedDay.temp_min}°
          </div>
          <div className="flex items-center">
            <BiSolidDropletHalf className="mr-1 text-lg" />
            Humedad: {selectedDay.humidity}%
          </div>
          <div className="flex items-center">
            <FiWind className="mr-1 text-lg" />
            Viento: {selectedDay.windSpeed} km/h
          </div>
          <div className="flex items-center col-span-2 justify-between">
            <div>
              <GiSunrise className="mr-1 text-lg" />
              Amanecer: {formatToLocalTime(selectedDay.sunrise)}
            </div>
            <div>
              <GiSunset className="mr-1 text-lg" />
              Atardecer: {formatToLocalTime(selectedDay.sunset)}
            </div>
          </div>
        </div>

        {/* Previsión por Horas */}
        <div>
          <h3 className="text-md font-semibold mb-2 text-center">
            Previsión por Horas
          </h3>
          <div className="space-y-2" aria-live="polite">
            {filteredHourlyData.length > 0 ? (
              filteredHourlyData.map((hour, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-900 bg-opacity-75 p-3 rounded-lg shadow-md"
                >
                  <div className="flex items-center">
                    <img
                      src={hour.icon}
                      alt={hour.title}
                      className="w-10 h-10 mr-2"
                    />
                    <p className="text-sm font-medium">{hour.title}</p>
                  </div>
                  <p className="text-sm font-bold">{hour.temp.toFixed(1)}°</p>
                </div>
              ))
            ) : (
              <p className="text-center">
                No hay datos disponibles para este día.
              </p>
            )}
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigateDay("previous")}
            disabled={isFirstDay}
            className={`px-4 py-2 rounded-lg font-bold transition-transform hover:scale-105 ${
              isFirstDay ? "hidden" : "text-white"
            }`}
            aria-label={isFirstDay ? "Primer día" : `Ver el día anterior: ${previousDayLabel}`}
          >
            {`← ${previousDayLabel}`}
          </button>
          <button
            onClick={() => navigateDay("next")}
            disabled={isLastDay}
            className={`px-4 py-2 rounded-lg font-bold transition-transform hover:scale-105 ${
              isLastDay ? "hidden" : "text-white"
            }`}
            aria-label={isLastDay ? "Último día" : `Ver el próximo día: ${nextDayLabel}`}
          >
            {`${nextDayLabel} →`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherModal;

