import React, { memo } from "react";
import DailyButton from "./DailyButtons";

export interface ForecastData {
  title: string;
  icon: string;
  temp: number;
  date: string;
}

interface ForecastProps {
  title: string;
  data: ForecastData[];
  onSelectDay: (day: ForecastData) => void;
}

const Forecast: React.FC<ForecastProps> = memo(({ title, data, onSelectDay }) => {
  const isHourly = React.useMemo(() => title.includes("3 horas"), [title]);

  const formatDayOfWeekWithDate = React.useCallback(
    (dateString: string): string => {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha no válida";

      const options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric" };
      return new Intl.DateTimeFormat("es-ES", options).format(date);
    },
    []
  );

  const formatHour = React.useCallback(
    (dateString: string): string => {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Hora desconocida"
        : date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    },
    []
  );

  const processedData = React.useMemo(
    () =>
      data.map((d) => ({
        ...d,
        formattedTitle: isHourly ? formatHour(d.date) : formatDayOfWeekWithDate(d.date),
      })),
    [data, isHourly, formatHour, formatDayOfWeekWithDate]
  );

  const stableOnSelectDay = React.useCallback(
    (day: string) => {
      onSelectDay(day);
    },
    [onSelectDay]
  );

  return (
    <section
      className="mt-6 w-full max-w-md"
      aria-labelledby="forecast-title"
      role="region"
    >
      {/* Título de la sección */}
      <header className="flex items-center justify-start mb-2">
        <h2 id="forecast-title" className="font-medium uppercase text-lg">{title}</h2>
      </header>
      <hr className="my-1" />

      {/* Lista de previsión */}
      <ul className="flex flex-wrap justify-between" role="list">
        {processedData.map((d) => (
          <ForecastItem
            key={d.date}
            data={d}
            isHourly={isHourly}
            onSelectDay={stableOnSelectDay}
          />
        ))}
      </ul>
    </section>
  );
});

interface ForecastItemProps {
  data: ForecastData & { formattedTitle: string };
  isHourly: boolean;
  onSelectDay: (day: ForecastData) => void;
}

const ForecastItem: React.FC<ForecastItemProps> = React.memo(
  ({ data, isHourly, onSelectDay }) => (
    <li className="w-1/4 sm:w-1/3 md:w-1/5 p-2">
      <button
        onClick={() => onSelectDay(data)}
        className="flex flex-col items-center justify-center w-full p-2 bg-opacity-75 hover:bg-gray-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Previsión para ${
          isHourly ? `las ${data.formattedTitle}` : data.formattedTitle
        }, temperatura de ${data.temp} grados`}
      >
        <DailyButton title={data.formattedTitle} icon={data.icon} temp={data.temp} />
      </button>
    </li>
  )
);

export default Forecast;
