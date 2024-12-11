import React, { memo } from 'react';

interface DailyButtonProps {
  title: string; // Día u Hora
  icon: string; // Icono del clima
  temp: number; // Temperatura
}

const DailyButton: React.FC<DailyButtonProps> = memo(({ title, icon, temp }) => {
  return (
    <div className="flex flex-col items-center p-2 rounded-lg">
      <p className="font-medium">{title}</p>
      <img src={icon} alt="Weather icon" className="w-10 h-10" />
      <p className="text-lg">{temp}°C</p>
    </div>
  );
});

export default DailyButton;
