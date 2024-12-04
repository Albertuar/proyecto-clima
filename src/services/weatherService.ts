import { DateTime } from 'luxon';

const API_KEY = 'd4f8497946c666c8d867aec6b017323f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

interface Coordinates {
    lon: number;
    lat: number;
}

interface WeatherMain {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
}

interface WeatherInfo {
    coord: Coordinates;
    main: WeatherMain;
    name: string;
    dt: number;
    dt_txt: string;
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    weather: Array<{
        main: string;
        icon: string;
    }>;
    wind: {
        speed: number;
    };
    timezone: number;
}

interface FormattedWeatherData {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    name: string;
    country: string;
    sunrise: string;
    sunset: string;
    speed: number;
    details: string;
    icon: string;
    formattedLocalTime: string;
    dt: number;
    timezone: number;
    lat: number;
    lon: number;
}

interface ForecastWeather {
    hourly: Array<{
        temp: number;
        title: string;
        icon: string;
        date: string;
    }>;
    daily: Array<{
        temp: number;
        title: string;
        icon: string;
        date: string;
    }>;
}

const getWeatherData = (infoType: string, searchParams: Record<string, string | number>) => {
    const url = new URL(BASE_URL + infoType);
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY }).toString();

    return fetch(url).then((res) => res.json());
};

const iconURLFromCode = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

const formatToLocalTime = (
    secs: number, 
    offset: number, 
    format = "cccc, dd, LLL, yyyy ' | Local time: 'hh:mm a"
) => {
    return DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);
};

const formatCurrent = (data: WeatherInfo): FormattedWeatherData => {
    const { 
        coord: { lat, lon },
        main: { temp, feels_like, temp_min, temp_max, humidity },
        name, dt, sys: { country, sunrise, sunset },
        weather,
        wind: { speed },
        timezone,
    } = data;

    const { main: details, icon } = weather[0];
    const formattedLocalTime = formatToLocalTime(dt, timezone);

    return {
        temp, 
        feels_like, 
        temp_min, 
        temp_max, 
        humidity, 
        name, 
        country, 
        sunrise: formatToLocalTime(sunrise, timezone, 'hh:mm a'),
        sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'),
        speed,
        details,
        icon: iconURLFromCode(icon),
        formattedLocalTime,
        dt,
        timezone,
        lat,
        lon,
    };
};

const formatForecastWeather = (secs: number, offset: number, data: WeatherInfo[]): ForecastWeather => {
    const hourly = data
        .filter(f => f.dt > secs)
        .map(f => ({
            temp: f.main.temp,
            title: formatToLocalTime(f.dt, offset, 'hh:mm a'),
            icon: iconURLFromCode(f.weather[0].icon),
            date: f.dt_txt,
        }))
        .slice(0, 5);

    const daily = data
        .filter((f) => f.dt_txt.slice(-8) === "00:00:00")
        .map(f => ({
            temp: f.main.temp,
            temp_min: f.main.temp_min,
            temp_max: f.main.temp_max,
            title: formatToLocalTime(f.dt, offset, 'ccc'),
            icon: iconURLFromCode(f.weather[0].icon),
            date: f.dt_txt,
            humidity: f.main.humidity,
            windSpeed: f.wind.speed,
            details: f.weather[0].main,
            sunrise: formatToLocalTime(f.sys.sunrise, offset, 'hh:mm a'),
            sunset: formatToLocalTime(f.sys.sunset, offset, 'hh:mm a'),
        }));
        
    return { hourly, daily };
};

const getFormattedWeatherData = async (searchParams: Record<string, string | number>): Promise<FormattedWeatherData & ForecastWeather> => {
    const formattedCurrentWeather = await getWeatherData("weather", searchParams).then(formatCurrent);

    const { dt, lat, lon, timezone } = formattedCurrentWeather;

    const formattedForecastWeather = await getWeatherData('forecast', { lat, lon, units: searchParams.units }).then((d: { list: WeatherInfo[] }) => formatForecastWeather(dt, timezone, d.list));

    return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

export default getFormattedWeatherData;
