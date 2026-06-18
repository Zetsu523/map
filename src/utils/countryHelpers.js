import { countriesInfo } from "../data/countries-info.js";
import { normalizeText } from "./normalizeText.js";

const COUNTRY_NAME_KEYS = [
  "ADMIN",
  "NAME",
  "name",
  "sovereignt",
  "SOVEREIGNT",
  "NAME_LONG",
  "BRK_NAME"
];

function getAliases(info) {
  if (!info) {
    return [];
  }

  return [info.name, ...(info.aliases ?? [])].filter(Boolean);
}

export function getCountryName(feature) {
  if (!feature?.properties) {
    return "Pays inconnu";
  }

  for (const key of COUNTRY_NAME_KEYS) {
    if (feature.properties[key]) {
      return feature.properties[key];
    }
  }

  return "Pays inconnu";
}

export function isCountryFeature(feature) {
  const geometryType = feature?.geometry?.type;
  const name = getCountryName(feature);

  return (
    feature?.type === "Feature" &&
    (geometryType === "Polygon" || geometryType === "MultiPolygon") &&
    name !== "Pays inconnu" &&
    Boolean(normalizeText(name))
  );
}

export function findCountryInfo(countryName, infoMap = countriesInfo) {
  const normalizedName = normalizeText(countryName);

  if (!normalizedName) {
    return null;
  }

  return (
    Object.values(infoMap).find((info) =>
      getAliases(info).some((alias) => normalizeText(alias) === normalizedName)
    ) ?? null
  );
}

export function findCountryFeature(countryName, countries = [], infoMap = countriesInfo) {
  const info = findCountryInfo(countryName, infoMap);
  const candidates = new Set(
    [countryName, ...getAliases(info)].filter(Boolean).map((value) => normalizeText(value))
  );

  return (
    countries.find((feature) => candidates.has(normalizeText(getCountryName(feature)))) ?? null
  );
}

export function matchCountryBySearch(searchValue, infoMap = countriesInfo, countries = []) {
  const query = normalizeText(searchValue);

  if (!query) {
    return null;
  }

  const detailedCountries = Object.values(infoMap);
  const exactInfo = detailedCountries.find((info) =>
    getAliases(info).some((alias) => normalizeText(alias) === query)
  );

  if (exactInfo) {
    return {
      name: exactInfo.name,
      info: exactInfo,
      feature: findCountryFeature(exactInfo.name, countries, infoMap)
    };
  }

  const partialInfo = detailedCountries.find((info) =>
    getAliases(info).some((alias) => normalizeText(alias).includes(query))
  );

  if (partialInfo) {
    return {
      name: partialInfo.name,
      info: partialInfo,
      feature: findCountryFeature(partialInfo.name, countries, infoMap)
    };
  }

  const exactFeature = countries.find((feature) => normalizeText(getCountryName(feature)) === query);

  if (exactFeature) {
    const name = getCountryName(exactFeature);

    return {
      name,
      info: findCountryInfo(name, infoMap),
      feature: exactFeature
    };
  }

  const partialFeature = countries.find((feature) =>
    normalizeText(getCountryName(feature)).includes(query)
  );

  if (!partialFeature) {
    return null;
  }

  const name = getCountryName(partialFeature);

  return {
    name,
    info: findCountryInfo(name, infoMap),
    feature: partialFeature
  };
}

export function countryMatchesSelection(feature, selectedCountry) {
  if (!isCountryFeature(feature) || !selectedCountry) {
    return false;
  }

  const featureName = normalizeText(getCountryName(feature));
  const aliases = [
    selectedCountry.name,
    selectedCountry.featureName,
    ...getAliases(selectedCountry.info)
  ]
    .map((value) => normalizeText(value))
    .filter(Boolean);

  return Boolean(featureName) && aliases.includes(featureName);
}

function collectCoordinatePairs(coordinates, points = []) {
  if (!Array.isArray(coordinates)) {
    return points;
  }

  if (
    coordinates.length >= 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  ) {
    points.push(coordinates);
    return points;
  }

  coordinates.forEach((item) => collectCoordinatePairs(item, points));
  return points;
}

export function getFeatureCenter(feature) {
  const points = collectCoordinatePairs(feature?.geometry?.coordinates);

  if (!points.length) {
    return null;
  }

  const totals = points.reduce(
    (accumulator, [lng, lat]) => ({
      lat: accumulator.lat + lat,
      lng: accumulator.lng + lng
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: totals.lat / points.length,
    lng: totals.lng / points.length
  };
}

export function createFallbackCountryInfo(featureOrName) {
  const isFeature = typeof featureOrName === "object" && featureOrName !== null;
  const name = isFeature ? getCountryName(featureOrName) : String(featureOrName || "Pays inconnu");
  const center = isFeature ? getFeatureCenter(featureOrName) : null;

  return {
    name,
    aliases: [name],
    continent: "À compléter",
    capital: "À compléter",
    population: "À compléter",
    area: "À compléter",
    lat: center?.lat,
    lng: center?.lng,
    description:
      "Fiche locale créée automatiquement depuis les frontières GeoJSON. Les informations détaillées restent à enrichir."
  };
}

function pointIsInRing(lng, lat, ring) {
  let isInside = false;

  for (let index = 0, previousIndex = ring.length - 1; index < ring.length; previousIndex = index++) {
    const [currentLng, currentLat] = ring[index];
    const [previousLng, previousLat] = ring[previousIndex];
    const crossesLatitude = currentLat > lat !== previousLat > lat;

    if (!crossesLatitude) {
      continue;
    }

    const intersectionLng =
      ((previousLng - currentLng) * (lat - currentLat)) / (previousLat - currentLat) +
      currentLng;

    if (lng < intersectionLng) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function pointIsInPolygon(lng, lat, polygon) {
  const [outerRing, ...holes] = polygon;

  if (!outerRing || !pointIsInRing(lng, lat, outerRing)) {
    return false;
  }

  return !holes.some((hole) => pointIsInRing(lng, lat, hole));
}

export function findCountryAtCoordinates({ lat, lng } = {}, countries = []) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return (
    countries.find((feature) => {
      const geometry = feature?.geometry;

      if (geometry?.type === "Polygon") {
        return pointIsInPolygon(lng, lat, geometry.coordinates);
      }

      if (geometry?.type === "MultiPolygon") {
        return geometry.coordinates.some((polygon) => pointIsInPolygon(lng, lat, polygon));
      }

      return false;
    }) ?? null
  );
}
