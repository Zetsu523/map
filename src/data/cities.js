export const CITY_DATASET_INFO = {
  source: "GeoNames cities1000",
  minPopulation: 1000
};

export function getCityDataUrl(countryCode) {
  return `${import.meta.env.BASE_URL}data/cities/${countryCode}.json`;
}

export function normalizeCityDataset(dataset) {
  if (!dataset || !Array.isArray(dataset.cities)) {
    return [];
  }

  return dataset.cities
    .map(([id, name, lat, lng, population, importance]) => ({
      id: `${dataset.countryCode}-${id}`,
      name,
      country: dataset.country,
      countryCode: dataset.countryCode,
      lat,
      lng,
      population,
      importance
    }))
    .filter(
      (city) =>
        city.name &&
        Number.isFinite(city.lat) &&
        Number.isFinite(city.lng) &&
        Number.isFinite(city.population)
    );
}
