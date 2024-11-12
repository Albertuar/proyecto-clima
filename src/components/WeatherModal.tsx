import Modal from 'react-modal';
import { BiXCircle } from "react-icons/bi";
import { FaThermometerEmpty } from "react-icons/fa";
import { BiSolidDropletHalf } from "react-icons/bi";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { DailyForecast } from "../App"; // Importa la interfaz DailyForecast


interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: DailyForecast | null;
  navigateDay: (direction: "previous" | "next") => void;
  formatBackground: () => string;
  isFirstDay: boolean;
  isLastDay: boolean;
}

const WeatherModal: React.FC<WeatherModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  navigateDay,
  formatBackground,
  isFirstDay,
  isLastDay
}) => {
  return (
    <Modal
      className={`h-auto md:h-[80vh] w-full md:w-[80%] lg:w-[60%] flex flex-col bg-gradient-to-br ${formatBackground()} bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 rounded-lg p-4 mx-auto backdrop-blur-sm`}
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Modal de Previsión Diaria"
    >
      <BiXCircle
        size={30}
        className="cursor-pointer text-white transition ease-out hover:scale-125"
        onClick={onClose}
      />
      {selectedDay && (
        <div className="text-white text-center">
          <h2 className="text-2xl font-semibold mb-2">{selectedDay.title}</h2>
          <img src={selectedDay.icon} alt="weather icon" className="mx-auto mb-2" />

          <div className="flex items-center justify-center text-lg mt-2">
            <FaThermometerEmpty size={20} className="mr-2" />
            <p>Temperatura: {selectedDay.temp}°C</p>
          </div>

          {selectedDay.humidity !== undefined && (
            <div className="flex items-center justify-center text-lg mt-2">
              <BiSolidDropletHalf size={20} className="mr-2" />
              <p>Humedad: {selectedDay.humidity}%</p>
            </div>
          )}

          {selectedDay.windSpeed !== undefined && (
            <div className="flex items-center justify-center text-lg mt-2">
              <FiWind size={20} className="mr-2" />
              <p>Viento: {selectedDay.windSpeed} km/h</p>
            </div>
          )}

          <div className="flex items-center justify-center text-lg mt-2">
            <MdKeyboardArrowUp size={20} className="mr-2" />
            <p>Temp Max: {selectedDay.temp_max}°C</p>
          </div>
          <div className="flex items-center justify-center text-lg mt-2">
            <MdKeyboardArrowDown size={20} className="mr-2" />
            <p>Temp Min: {selectedDay.temp_min}°C</p>
          </div>

          <div className="flex items-center justify-center text-lg mt-2">
            <GiSunrise size={20} className="mr-2" />
            <p>Amanecer: {selectedDay.sunrise}</p>
          </div>
          <div className="flex items-center justify-center text-lg mt-2">
            <GiSunset size={20} className="mr-2" />
            <p>Atardecer: {selectedDay.sunset}</p>
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="text-base font-medium text-white px-4 py-2 rounded-md transition ease-in hover:scale-125"
              onClick={() => navigateDay("previous")}
              disabled={isFirstDay}
            >
              Día Anterior
            </button>
            <button
              className="text-base font-medium text-white px-4 py-2 rounded-md transition ease-in hover:scale-125"
              onClick={() => navigateDay("next")}
              disabled={isLastDay}
            >
              Día Siguiente
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default WeatherModal;
