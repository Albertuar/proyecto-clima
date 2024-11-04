import { FaThermometerEmpty } from "react-icons/fa";
import { BiSolidDropletHalf } from "react-icons/bi";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

interface VerticalDetail {
  id: number;
  Icon: React.ElementType;
  title: string;
  value: string;
}

interface HorizontalDetail {
  id: number;
  Icon: React.ElementType;
  title: string;
  value: string;
}

interface WeatherProps {
  details: string;
  icon: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  sunrise: string;
  sunset: string;
  speed: number;
  humidity: number;
  feels_like: number;
}

interface TempAndDetailsProps {
  weather: WeatherProps;
  unit: string;
}

const TempAndDetails: React.FC<TempAndDetailsProps> = ({ weather, unit }) => {
  const {
    details,
    icon,
    temp,
    temp_min,
    temp_max,
    sunrise,
    sunset,
    speed,
    humidity,
    feels_like,
  } = weather;

  const verticalDetails: VerticalDetail[] = [
    {
      id: 1,
      Icon: FaThermometerEmpty,
      title: "Sensación Térmica",
      value: `${feels_like.toFixed()}º`,
    },
    {
      id: 2,
      Icon: BiSolidDropletHalf,
      title: "Humedad",
      value: `${humidity.toFixed()}%`,
    },
    {
      id: 3,
      Icon: FiWind,
      title: "Viento",
      value: `${speed.toFixed()} ${unit === 'metric' ? "km/h" : 'm/s'}`,
    },
  ];

  const horizontalDetails: HorizontalDetail[] = [
    {
      id: 1,
      Icon: GiSunrise,
      title: "Amanece",
      value: sunrise,
    },
    {
      id: 2,
      Icon: GiSunset,
      title: "Ocaso",
      value: sunset,
    },
    {
      id: 3,
      Icon: MdKeyboardArrowUp,
      title: "Temp Max",
      value: `${temp_max.toFixed()}º`,
    },
    {
      id: 4, 
      Icon: MdKeyboardArrowDown,
      title: "Temp Min",
      value: `${temp_min.toFixed()}º`,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-center py-6 text-xl text-cyan-300">
        <p>{details}</p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between py-3 text-xl">
        <img src={icon} alt="weather icon" className="w-20" />
        <p className="text-5xl">{`${temp.toFixed()}º`}</p>

        <div className="flex flex-col space-y-3 items-start">
          {verticalDetails.map(({ id, Icon, title, value }) => (
            <div key={id} className="flex font-light text-sm items-center justify-center">
              <Icon size={18} className="mr-1" />
              {`${title}:`}
              <span className="font-medium ml-1">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center space-x-10 text-sm py-3">
        {horizontalDetails.map(({ id, Icon, title, value }) => (
          <div key={id} className="flex flex-row items-center mb-2 md:mb-0">
            <Icon size={30} />
            <p className="font-light ml-1">
              {`${title}:`}
              <span className="font-medium ml-1">{value}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TempAndDetails;
