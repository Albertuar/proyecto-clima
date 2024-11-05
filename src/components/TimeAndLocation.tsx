import React from 'react';

interface WeatherProps {
  formattedLocalTime: string;
  name: string;
  country: string;
}

interface TimeAndLocationProps {
  weather: WeatherProps;
}

const TimeAndLocation: React.FC<TimeAndLocationProps> = ({ 
  weather: { formattedLocalTime, name, country },
}) => {
  return (
    <div className="flex flex-col items-center my-6">
      <p className="text-base sm:text-xl font-extralight">
        {formattedLocalTime}
      </p>

      <p className="text-lg sm:text-3xl font-medium mt-2">
        {`${name}, ${country}`}
      </p>
    </div>
  );
}

export default TimeAndLocation;

