const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const CURRENT_WEATHER_FIELDS = [
  "temperature_2m",
  "weather_code",
  "wind_speed_10m",
  "relative_humidity_2m"
];

export function getWeatherCondition(weatherCode) {
  if (weatherCode === 0) {
    return "Ciel dégagé";
  }

  if ([1, 2, 3].includes(weatherCode)) {
    return "Partiellement nuageux";
  }

  if ([45, 48].includes(weatherCode)) {
    return "Brouillard";
  }

  if ([51, 53, 55].includes(weatherCode)) {
    return "Bruine";
  }

  if ([61, 63, 65].includes(weatherCode)) {
    return "Pluie";
  }

  if ([71, 73, 75].includes(weatherCode)) {
    return "Neige";
  }

  if (weatherCode === 95) {
    return "Orage";
  }

  return "Météo variable";
}

export async function getCityWeather(lat, lng, options = {}) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Coordonnées météo invalides");
  }

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: CURRENT_WEATHER_FIELDS.join(","),
    timezone: "auto"
  });

  const response = await fetch(`${OPEN_METEO_URL}?${params.toString()}`, {
    signal: options.signal
  });

  if (!response.ok) {
    throw new Error(`Erreur météo ${response.status}`);
  }

  const data = await response.json();
  const current = data.current;
  const units = data.current_units ?? {};

  if (!current) {
    throw new Error("Météo actuelle absente");
  }

  return {
    condition: getWeatherCondition(current.weather_code),
    humidity: current.relative_humidity_2m,
    temperature: current.temperature_2m,
    time: current.time,
    units: {
      humidity: units.relative_humidity_2m ?? "%",
      temperature: units.temperature_2m ?? "°C",
      windSpeed: units.wind_speed_10m ?? "km/h"
    },
    weatherCode: current.weather_code,
    windSpeed: current.wind_speed_10m
  };
}
