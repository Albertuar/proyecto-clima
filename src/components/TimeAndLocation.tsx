import React from "react";

interface WeatherProps {
  formattedLocalTime: string;
  location: string; // Precalculado: "name, country"
}

interface TimeAndLocationProps {
  weather: WeatherProps;
}

const TimeAndLocation: React.FC<TimeAndLocationProps> = React.memo(
  ({ weather: { formattedLocalTime, location } }) => {
    return (
      <div className="flex flex-col items-center my-6" aria-labelledby="location-header">
        {/* Hora local */}
        <p
          id="local-time"
          className="text-base sm:text-xl font-extralight"
          aria-live="polite"
        >
          {formattedLocalTime}
        </p>

        {/* Ubicación */}
        <h1
          id="location-header"
          className="text-lg sm:text-3xl font-medium mt-2"
        >
          {location}
        </h1>
      </div>
    );
  }
);

export default TimeAndLocation;
