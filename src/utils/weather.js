// Live weather powered by Open-Meteo (https://open-meteo.com) — a free,
// no-API-key weather service. Only lat/lon is required, which every
// country/city record in src/data already carries.

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Freezing drizzle', icon: '🌧️' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌦️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Freezing rain', icon: '🌧️' },
  67: { description: 'Heavy freezing rain', icon: '🌧️' },
  71: { description: 'Slight snow fall', icon: '🌨️' },
  73: { description: 'Moderate snow fall', icon: '🌨️' },
  75: { description: 'Heavy snow fall', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm, slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm, heavy hail', icon: '⛈️' },
};

export function describeWeatherCode(code) {
  return WEATHER_CODES[code] || { description: 'Clear sky', icon: '☀️' };
}

export function celsiusToFahrenheit(c) {
  return c * 9 / 5 + 32;
}

const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

export function degreesToCompass(deg) {
  if (deg == null || Number.isNaN(deg)) return '';
  const index = Math.round(deg / 22.5) % 16;
  return COMPASS_POINTS[index];
}

/**
 * Fetch current conditions + a 5 day hourly forecast in one call.
 * Returns null (instead of throwing) on network failure so screens can
 * show a friendly inline error instead of crashing.
 */
export async function fetchWeatherBundle(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'weather_code',
      'is_day',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'surface_pressure',
      'relative_humidity_2m',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    daily: 'sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code',
    forecast_days: '6',
    timezone: 'auto',
    wind_speed_unit: 'kmh',
  });

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`);
  const json = await res.json();

  const current = json.current
    ? {
        temperatureC: json.current.temperature_2m,
        temperatureF: celsiusToFahrenheit(json.current.temperature_2m),
        humidity: json.current.relative_humidity_2m,
        pressure: json.current.surface_pressure,
        windSpeedKph: json.current.wind_speed_10m,
        windDirectionDeg: json.current.wind_direction_10m,
        weatherCode: json.current.weather_code,
        isDay: json.current.is_day === 1,
        ...describeWeatherCode(json.current.weather_code),
      }
    : null;

  const hourly = [];
  if (json.hourly && json.hourly.time) {
    json.hourly.time.forEach((time, i) => {
      hourly.push({
        time,
        temperatureC: json.hourly.temperature_2m[i],
        temperatureF: celsiusToFahrenheit(json.hourly.temperature_2m[i]),
        weatherCode: json.hourly.weather_code[i],
        pressure: json.hourly.surface_pressure[i],
        humidity: json.hourly.relative_humidity_2m[i],
        windSpeedKph: json.hourly.wind_speed_10m[i],
        windDirectionDeg: json.hourly.wind_direction_10m[i],
        ...describeWeatherCode(json.hourly.weather_code[i]),
      });
    });
  }

  const daily = [];
  if (json.daily && json.daily.time) {
    json.daily.time.forEach((date, i) => {
      daily.push({
        date,
        sunrise: json.daily.sunrise ? json.daily.sunrise[i] : null,
        sunset: json.daily.sunset ? json.daily.sunset[i] : null,
        maxC: json.daily.temperature_2m_max[i],
        minC: json.daily.temperature_2m_min[i],
        weatherCode: json.daily.weather_code[i],
        ...describeWeatherCode(json.daily.weather_code[i]),
      });
    });
  }

  return { current, hourly, daily };
}

export default {
  fetchWeatherBundle,
  describeWeatherCode,
  celsiusToFahrenheit,
  degreesToCompass,
  WEATHER_CODES,
};
