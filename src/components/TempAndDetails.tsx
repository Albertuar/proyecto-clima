import { FaThermometerEmpty } from "react-icons/fa";
import { BiSolidDropletHalf } from "react-icons/bi";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import React from "react";

const DetailItem: React.FC<{ Icon: React.ElementType; title: string; value: string }> = React.memo(
  ({ Icon, title, value }) => (
    <li className="flex items-center text-sm">
      <Icon size={18} className="mr-1" />
      <span>{title}:</span>
      <span className="font-medium ml-1">{value}</span>
    </li>
  )
);

const TempAndDetails: React.FC<TempAndDetailsProps> = ({ weather, unit }) => {
  const { details, icon, temp, temp_min, temp_max, sunrise, sunset, speed, humidity, feels_like } =
    weather;

  const feelsLike = `${feels_like.toFixed()}º`;
  const humidityText = `${humidity.toFixed()}%`;
  const windSpeed = `${speed.toFixed()} ${unit === "metric" ? "km/h" : "m/s"}`;
  const tempMax = `${temp_max.toFixed()}º`;
  const tempMin = `${temp_min.toFixed()}º`;
  const tempCurrent = `${temp.toFixed()}º`;

  const verticalDetails = React.useMemo(
    () => [
      { id: 1, Icon: FaThermometerEmpty, title: "Sensación Térmica", value: feelsLike },
      { id: 2, Icon: BiSolidDropletHalf, title: "Humedad", value: humidityText },
      { id: 3, Icon: FiWind, title: "Viento", value: windSpeed },
    ],
    [feelsLike, humidityText, windSpeed]
  );

  const horizontalDetails = React.useMemo(
    () => [
      { id: 1, Icon: GiSunrise, title: "Amanece", value: sunrise },
      { id: 2, Icon: GiSunset, title: "Ocaso", value: sunset },
      { id: 3, Icon: MdKeyboardArrowUp, title: "Temp Max", value: tempMax },
      { id: 4, Icon: MdKeyboardArrowDown, title: "Temp Min", value: tempMin },
    ],
    [sunrise, sunset, tempMax, tempMin]
  );

  return (
    <section className="p-4" aria-labelledby="weather-details-heading">
      <div className="flex items-center justify-center py-6 text-xl text-cyan-300">
        <p>{details}</p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between py-3 text-xl">
        <img src={icon} alt={`Ícono del clima: ${details}`} className="w-20" />
        <p className="text-5xl">{tempCurrent}</p>
        <ul className="flex flex-col space-y-3 items-start">
          {verticalDetails.map(({ id, ...props }) => (
            <DetailItem key={id} {...props} />
          ))}
        </ul>
      </div>
      <ul className="flex flex-col md:flex-row items-center justify-center space-x-10 text-sm py-3">
        {horizontalDetails.map(({ id, ...props }) => (
          <DetailItem key={id} {...props} />
        ))}
      </ul>
    </section>
  );
};

export default TempAndDetails;
