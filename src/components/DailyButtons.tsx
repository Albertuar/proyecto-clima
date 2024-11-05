
import React from 'react';

interface DailyButtonProps {
  title: string;
  icon: string;
  temp: number;
}

const handleOnClick = () => {
  console.log ("Click")

}

const DailyButton: React.FC<DailyButtonProps> = ({ title, icon, temp }) => {
  return (
    <button onClick= {handleOnClick} className="flex flex-col items-center p-2 rounded-lg hover:bg-blue-300 transition">
      <p className="font-medium">{title}</p>
      <img src={icon} alt="Weather icon" className="w-10 h-10" />
      <p className="text-lg">{temp}ºC</p>
    </button>
  );
};

export default DailyButton;
