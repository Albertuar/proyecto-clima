import React from 'react';
import DailyButton from './DailyButtons';

export interface ForecastData {
  title: string;
  icon: string;
  temp: number;
} 

interface ForecastProps {
  title: string;
  data: ForecastData[];
  onSelectDay: (day: ForecastData) => void; 
}

const Forecast: React.FC<ForecastProps> = ({ title, data, onSelectDay }) => {
  return (
    <div className="mt-6 w-full max-w-md">
      <div className="flex items-center justify-start mb-2">
        <p className="font-medium uppercase text-lg">{title}</p>
      </div>
      <hr className="my-1" />

      <div className="flex flex-wrap justify-between">
        {data.map((d, index) => (
          <div 
            key={index}
            className="flex flex-col items-center justify-center w-1/4 sm:w-1/3 md:w-1/5 p-2"
            onClick={() => onSelectDay(d)} 
          >
            <DailyButton title={d.title} icon={d.icon} temp={d.temp}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;

