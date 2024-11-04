import React from 'react';
import { useParams, Link } from 'react-router-dom';

interface ForecastData {
  title: string;
  icon: string;
  temp: number;
  details?: string;
  humidity?: number;
  speed?: number;
  sunrise?: string;
  sunset?: string;
}

interface DayDetailsProps {
  forecastData: ForecastData[];
}

const DayDetails: React.FC<DayDetailsProps> = ({ forecastData }) => {
  const { dayTitle } = useParams<{ dayTitle: string }>();
  const dayData = forecastData.find(day => day.title === dayTitle);

  if (!dayData) {
    return <p>Datos no encontrados para el día seleccionado.</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-md text-center">
      <Link to="/" className="text-blue-500 underline mb-4 inline-block">Volver</Link>
      <h2 className="text-2xl font-semibold">{dayData.title}</h2>
      <img src={dayData.icon} alt="Weather icon" className="w-20 mx-auto my-2" />
      <p className="text-lg">Temperatura: {dayData.temp}ºC</p>
      <p>Detalles: {dayData.details}</p>
      <p>Humedad: {dayData.humidity}%</p>
      <p>Velocidad del viento: {dayData.speed} m/s</p>
      <p>Amanecer: {dayData.sunrise}</p>
      <p>Ocaso: {dayData.sunset}</p>
    </div>
  );
};

export default DayDetails;
