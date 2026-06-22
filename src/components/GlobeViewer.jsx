import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { MapPin, X } from "lucide-react";
import { getCityDataUrl, normalizeCityDataset } from "../data/cities.js";
import { waterLabels } from "../data/water-labels.js";
import {
  countryMatchesSelection,
  findCountryAtCoordinates,
  findCountryInfo,
  getCountryName,
  isCountryFeature
} from "../utils/countryHelpers.js";
import { getCityWeather } from "../services/weatherService.js";

const MIN_GLOBE_SIZE = 320;
const DEFAULT_GLOBE_ALTITUDE = 2.5;
const CITY_ZOOM_THRESHOLD = 1.18;
const CITY_LAYER_PROFILES = [
  {
    maxAltitude: 0.18,
    minPopulation: 1000,
    maxCount: 42,
    cellDegrees: 0.34
  },
  {
    maxAltitude: 0.26,
    minPopulation: 5000,
    maxCount: 34,
    cellDegrees: 0.62
  },
  {
    maxAltitude: 0.38,
    minPopulation: 15000,
    maxCount: 28,
    cellDegrees: 1.15
  },
  {
    maxAltitude: 0.55,
    minPopulation: 50000,
    maxCount: 22,
    cellDegrees: 1.9
  },
  {
    maxAltitude: 0.78,
    minPopulation: 150000,
    maxCount: 14,
    cellDegrees: 3
  },
  {
    maxAltitude: CITY_ZOOM_THRESHOLD,
    minPopulation: 500000,
    maxCount: 8,
    cellDegrees: 8
  }
];
const VIEW_UPDATE_INTERVAL_MS = 120;
const MOON_RADIUS = 8;
const MOON_ORBIT_RADIUS = 190;
const LUNAR_SIDEREAL_DAYS = 27.321661;
const LUNAR_ANIMATION_DAYS_PER_SECOND = LUNAR_SIDEREAL_DAYS / 70;
const LUNAR_PRESENTATION_OFFSET_DAYS = LUNAR_SIDEREAL_DAYS * 0.48;
const J2000_UTC = Date.UTC(2000, 0, 1, 12, 0, 0);
const SUN_RADIUS_KM = 696340;
const SUN_DISTANCE_KM = 149597870;
const SUN_DISTANCE = 760;
const SUN_RADIUS = SUN_DISTANCE * (SUN_RADIUS_KM / SUN_DISTANCE_KM);
const SUN_GLOW_SIZE = SUN_RADIUS * 34;
const SUN_POSITION = new THREE.Vector3(0.48, 0.25, -1).normalize().multiplyScalar(SUN_DISTANCE);
const STAR_COUNT = 1100;
const STAR_FIELD_RADIUS = 980;
const STAR_FIELD_DEPTH = 520;

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function degreesToRadians(value) {
  return (value * Math.PI) / 180;
}

function getDaysSinceJ2000(date = new Date()) {
  return (date.getTime() - J2000_UTC) / 86400000;
}

function getMoonScenePosition(daysSinceJ2000) {
  const meanLongitude = degreesToRadians(normalizeDegrees(218.316 + 13.176396 * daysSinceJ2000));
  const meanAnomaly = degreesToRadians(normalizeDegrees(134.963 + 13.064993 * daysSinceJ2000));
  const argumentOfLatitude = degreesToRadians(
    normalizeDegrees(93.272 + 13.22935 * daysSinceJ2000)
  );

  const eclipticLongitude = meanLongitude + degreesToRadians(6.289) * Math.sin(meanAnomaly);
  const eclipticLatitude = degreesToRadians(5.128) * Math.sin(argumentOfLatitude);
  const distanceRatio = (385001 - 20905 * Math.cos(meanAnomaly)) / 385001;
  const radius = MOON_ORBIT_RADIUS * distanceRatio;
  const latitudeCos = Math.cos(eclipticLatitude);

  return new THREE.Vector3(
    radius * latitudeCos * Math.cos(eclipticLongitude),
    radius * Math.sin(eclipticLatitude),
    radius * latitudeCos * Math.sin(eclipticLongitude)
  );
}

function createMoonOrbitLine(startDays) {
  const points = Array.from({ length: 220 }, (_, index) =>
    getMoonScenePosition(startDays + (index / 219) * LUNAR_SIDEREAL_DAYS)
  );
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: "#bae6fd",
    transparent: true,
    opacity: 0.24,
    depthWrite: false
  });

  return new THREE.LineLoop(geometry, material);
}

function seededRandom(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function createStarField() {
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const color = new THREE.Color();

  for (let index = 0; index < STAR_COUNT; index += 1) {
    const theta = seededRandom(index + 1) * Math.PI * 2;
    const phi = Math.acos(2 * seededRandom(index + 2000) - 1);
    const radius = STAR_FIELD_RADIUS + seededRandom(index + 4000) * STAR_FIELD_DEPTH;
    const positionIndex = index * 3;
    const brightness = 0.62 + seededRandom(index + 6000) * 0.38;
    const hue = 0.58 + seededRandom(index + 8000) * 0.09;

    positions[positionIndex] = radius * Math.sin(phi) * Math.cos(theta);
    positions[positionIndex + 1] = radius * Math.cos(phi);
    positions[positionIndex + 2] = radius * Math.sin(phi) * Math.sin(theta);

    color.setHSL(hue, 0.22, brightness);
    colors[positionIndex] = color.r;
    colors[positionIndex + 1] = color.g;
    colors[positionIndex + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const stars = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 2.2,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthTest: true,
      depthWrite: false
    })
  );

  stars.name = "Champ d'etoiles";
  stars.frustumCulled = false;
  stars.renderOrder = -60;

  return stars;
}

function createSunGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");
  const glow = ctx.createRadialGradient(128, 128, 16, 128, 128, 126);
  glow.addColorStop(0, "rgba(255, 249, 196, 0.95)");
  glow.addColorStop(0.24, "rgba(251, 191, 36, 0.5)");
  glow.addColorStop(0.54, "rgba(249, 115, 22, 0.18)");
  glow.addColorStop(1, "rgba(249, 115, 22, 0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createSunObject(sunTexture) {
  const group = new THREE.Group();
  group.name = "Soleil";
  group.position.copy(SUN_POSITION);

  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createSunGlowTexture(),
      color: "#fde68a",
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false
    })
  );
  glow.name = "Halo du Soleil";
  glow.scale.set(SUN_GLOW_SIZE, SUN_GLOW_SIZE, 1);
  glow.renderOrder = -20;

  const sun = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: sunTexture,
      color: "#fff7ad",
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false
    })
  );
  sun.name = "Soleil";
  sun.scale.set(SUN_RADIUS * 2, SUN_RADIUS * 2, 1);
  sun.renderOrder = -10;

  const light = new THREE.PointLight("#fde68a", 1.45, 900, 1.4);
  light.name = "Lumiere du Soleil";

  group.add(glow, sun, light);
  group.traverse((child) => {
    child.frustumCulled = false;
  });

  return group;
}

function disposeObject(object) {
  object.traverse((child) => {
    child.geometry?.dispose?.();

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => {
      material.map?.dispose?.();
      material.bumpMap?.dispose?.();
      material.dispose?.();
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPopulation(value) {
  if (!Number.isFinite(value)) {
    return "Non renseign\u00e9e";
  }

  return new Intl.NumberFormat("fr-FR").format(value);
}

function formatWeatherValue(value, unit) {
  if (!Number.isFinite(value)) {
    return "Non disponible";
  }

  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(value)} ${unit}`;
}

function getIso2Code(info) {
  return info?.aliases?.find((alias) => /^[A-Z]{2}$/.test(alias)) ?? null;
}

function getCountryFocusCode(selectedCountry, viewCountryName) {
  const info =
    selectedCountry?.info ??
    findCountryInfo(selectedCountry?.featureName) ??
    findCountryInfo(selectedCountry?.name) ??
    findCountryInfo(viewCountryName);

  return getIso2Code(info);
}

function getCityLayerProfile(altitude) {
  if (!Number.isFinite(altitude)) {
    return null;
  }

  return CITY_LAYER_PROFILES.find((profile) => altitude <= profile.maxAltitude) ?? null;
}

function getLongitudeDistance(firstLng, secondLng) {
  const diff = Math.abs(firstLng - secondLng) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function getCityDistanceFromCenter(city, center) {
  const latDiff = city.lat - center.lat;
  const lngDiff =
    getLongitudeDistance(city.lng, center.lng) *
    Math.cos(degreesToRadians((city.lat + center.lat) / 2));

  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}

function getCityGridKey(city, cellDegrees) {
  const latCell = Math.floor((city.lat + 90) / cellDegrees);
  const lngCell = Math.floor((city.lng + 180) / cellDegrees);

  return `${latCell}:${lngCell}`;
}

function pickVisibleCities(cities, profile) {
  if (!profile) {
    return [];
  }

  const occupiedCells = new Set();
  const pickedCities = [];

  for (const city of cities) {
    if (city.population < profile.minPopulation) {
      continue;
    }

    const cellKey = getCityGridKey(city, profile.cellDegrees);

    if (occupiedCells.has(cellKey)) {
      continue;
    }

    occupiedCells.add(cellKey);
    pickedCities.push({
      ...city,
      kind: "city"
    });

    if (pickedCities.length >= profile.maxCount) {
      break;
    }
  }

  return pickedCities;
}

function getCityLabelColor(city, selectedCity) {
  if (selectedCity?.id === city.id) {
    return "#facc15";
  }

  if (city.importance >= 5) {
    return "#fef3c7";
  }

  if (city.importance >= 3) {
    return "#e0f2fe";
  }

  return "#bfdbfe";
}

function getCityImportanceClass(city) {
  if (city.importance >= 5) {
    return "is-major";
  }

  if (city.importance >= 3) {
    return "is-medium";
  }

  return "is-small";
}

function getViewUpdateDistanceThreshold(altitude) {
  if (altitude <= 0.34) {
    return 0.08;
  }

  if (altitude <= 0.65) {
    return 0.18;
  }

  return 0.42;
}

function useElementSize(ref) {
  const [size, setSize] = useState({ width: 720, height: 620 });

  useEffect(() => {
    const element = ref.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.min(1100, Math.max(MIN_GLOBE_SIZE, Math.floor(entry.contentRect.width))),
        height: Math.min(820, Math.max(MIN_GLOBE_SIZE, Math.floor(entry.contentRect.height)))
      });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export default function GlobeViewer({
  countries,
  selectedCountry,
  onCountrySelect,
  onClearSelection
}) {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const moonSystemRef = useRef(null);
  const countryClickGuardRef = useRef(false);
  const weatherCacheRef = useRef(new Map());
  const viewUpdateRef = useRef({
    lat: 0,
    lng: 0,
    altitude: DEFAULT_GLOBE_ALTITUDE,
    countryName: null,
    time: 0
  });
  const [isReady, setIsReady] = useState(false);
  const [citiesEnabled, setCitiesEnabled] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [globeAltitude, setGlobeAltitude] = useState(DEFAULT_GLOBE_ALTITUDE);
  const [viewCountryName, setViewCountryName] = useState(null);
  const [cityDataByCountry, setCityDataByCountry] = useState({});
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [cityLoadError, setCityLoadError] = useState(null);
  const [cityWeather, setCityWeather] = useState(null);
  const [cityWeatherLoading, setCityWeatherLoading] = useState(false);
  const [cityWeatherError, setCityWeatherError] = useState(null);
  const size = useElementSize(containerRef);

  const selectedLat = selectedCountry?.lat;
  const selectedLng = selectedCountry?.lng;
  const earthTexture = `${import.meta.env.BASE_URL}textures/earth-blue-marble.jpg`;
  const focusedCountryCode = useMemo(
    () => getCountryFocusCode(selectedCountry, viewCountryName),
    [selectedCountry, viewCountryName]
  );
  const cityLayerProfile = useMemo(() => getCityLayerProfile(globeAltitude), [globeAltitude]);
  const citiesAreVisible = citiesEnabled && Boolean(focusedCountryCode) && Boolean(cityLayerProfile);

  const waterLabelData = useMemo(
    () =>
      waterLabels.map((label) => ({
        ...label,
        kind: "water",
        color: label.type === "mer" ? "#a7f3d0" : "#bae6fd"
      })),
    []
  );
  const visibleCities = useMemo(() => {
    if (!citiesAreVisible) {
      return [];
    }

    if (selectedCity) {
      return [
        {
          ...selectedCity,
          color: getCityLabelColor(selectedCity, selectedCity)
        }
      ];
    }

    const countryCities = focusedCountryCode ? cityDataByCountry[focusedCountryCode] ?? [] : [];
    return pickVisibleCities(countryCities, cityLayerProfile).map((city) => ({
      ...city,
      color: getCityLabelColor(city, selectedCity)
    }));
  }, [citiesAreVisible, focusedCountryCode, cityDataByCountry, cityLayerProfile, selectedCity]);

  useEffect(() => {
    if (!isReady || !globeRef.current) {
      return;
    }

    const controls = globeRef.current.controls();
    const renderer = globeRef.current.renderer?.();

    if (renderer?.setPixelRatio) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }

    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.55;
      controls.zoomSpeed = 0.75;
      controls.minDistance = 115;
      controls.maxDistance = 560;
      controls.autoRotate = false;
    }
  }, [isReady]);

  useEffect(() => {
    if (
      selectedCity &&
      (!citiesAreVisible || selectedCity.countryCode !== focusedCountryCode)
    ) {
      setSelectedCity(null);
    }
  }, [citiesAreVisible, focusedCountryCode, selectedCity]);

  useEffect(() => {
    if (!selectedCity) {
      setCityWeather(null);
      setCityWeatherLoading(false);
      setCityWeatherError(null);
      return undefined;
    }

    const cacheKey = `${selectedCity.lat.toFixed(4)},${selectedCity.lng.toFixed(4)}`;
    const cachedWeather = weatherCacheRef.current.get(cacheKey);

    if (cachedWeather) {
      setCityWeather(cachedWeather);
      setCityWeatherLoading(false);
      setCityWeatherError(null);
      return undefined;
    }

    const controller = new AbortController();

    setCityWeather(null);
    setCityWeatherLoading(true);
    setCityWeatherError(null);

    getCityWeather(selectedCity.lat, selectedCity.lng, { signal: controller.signal })
      .then((weather) => {
        if (controller.signal.aborted) {
          return;
        }

        weatherCacheRef.current.set(cacheKey, weather);
        setCityWeather(weather);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setCityWeatherError("Météo indisponible pour le moment.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCityWeatherLoading(false);
        }
      });

    return () => controller.abort();
  }, [selectedCity]);

  useEffect(() => {
    const countryCode = citiesAreVisible ? focusedCountryCode : null;

    if (!countryCode) {
      setCitiesLoading(false);
      setCityLoadError(null);
      return undefined;
    }

    if (cityDataByCountry[countryCode]) {
      setCitiesLoading(false);
      setCityLoadError(null);
      return undefined;
    }

    const controller = new AbortController();

    setCitiesLoading(true);
    setCityLoadError(null);

    fetch(getCityDataUrl(countryCode), { signal: controller.signal })
      .then((response) => {
        if (response.status === 404) {
          return null;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      })
      .then((dataset) => {
        if (controller.signal.aborted) {
          return;
        }

        setCityDataByCountry((currentData) => {
          if (currentData[countryCode]) {
            return currentData;
          }

          return {
            ...currentData,
            [countryCode]: normalizeCityDataset(dataset)
          };
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setCityLoadError("Villes indisponibles");
        setCityDataByCountry((currentData) => ({
          ...currentData,
          [countryCode]: []
        }));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCitiesLoading(false);
        }
      });

    return () => controller.abort();
  }, [citiesAreVisible, focusedCountryCode, cityDataByCountry]);

  useEffect(() => {
    if (!isReady || !globeRef.current || moonSystemRef.current) {
      return undefined;
    }

    const scene = globeRef.current.scene?.();
    const camera = globeRef.current.camera?.();
    const renderer = globeRef.current.renderer?.();

    if (!scene) {
      return undefined;
    }

    if (camera) {
      camera.far = Math.max(camera.far, 1800);
      camera.updateProjectionMatrix();
    }

    const textureLoader = new THREE.TextureLoader();
    const textureBaseUrl = `${import.meta.env.BASE_URL}textures/`;
    const moonTexture = textureLoader.load(`${textureBaseUrl}moon-color.jpg`);
    const moonBumpTexture = textureLoader.load(`${textureBaseUrl}moon-bump.jpg`);
    const sunTexture = textureLoader.load(`${textureBaseUrl}sun-sdo.jpg`);

    moonTexture.colorSpace = THREE.SRGBColorSpace;
    sunTexture.colorSpace = THREE.SRGBColorSpace;

    if (renderer?.capabilities?.getMaxAnisotropy) {
      moonTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      sunTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }

    const moonSystem = new THREE.Group();
    moonSystem.name = "Systeme Terre-Lune-Soleil";

    const starField = createStarField();
    const sun = createSunObject(sunTexture);
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(MOON_RADIUS, 64, 64),
      new THREE.MeshStandardMaterial({
        map: moonTexture,
        bumpMap: moonBumpTexture,
        bumpScale: 1.4,
        roughness: 1,
        metalness: 0,
        emissive: "#cbd5e1",
        emissiveIntensity: 0.32
      })
    );
    moon.name = "Lune";
    moon.frustumCulled = false;

    const orbitLine = createMoonOrbitLine(getDaysSinceJ2000() + LUNAR_PRESENTATION_OFFSET_DAYS);
    orbitLine.name = "Trajectoire lunaire";
    orbitLine.frustumCulled = false;

    moonSystem.add(starField, sun, orbitLine, moon);
    scene.add(moonSystem);
    moonSystemRef.current = moonSystem;

    const animationStart = performance.now();
    const startDays = getDaysSinceJ2000() + LUNAR_PRESENTATION_OFFSET_DAYS;
    let animationFrameId = 0;

    function animateMoon(time) {
      const elapsedSeconds = (time - animationStart) / 1000;
      const orbitDays = startDays + elapsedSeconds * LUNAR_ANIMATION_DAYS_PER_SECOND;
      const position = getMoonScenePosition(orbitDays);

      moon.position.copy(position);
      moon.lookAt(0, 0, 0);
      moon.rotateY(Math.PI);

      animationFrameId = window.requestAnimationFrame(animateMoon);
    }

    animationFrameId = window.requestAnimationFrame(animateMoon);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      scene.remove(moonSystem);
      disposeObject(moonSystem);
      moonSystemRef.current = null;
    };
  }, [isReady]);

  useEffect(() => {
    if (!isReady || !globeRef.current) {
      return;
    }

    if (Number.isFinite(selectedLat) && Number.isFinite(selectedLng)) {
      viewUpdateRef.current = {
        ...viewUpdateRef.current,
        lat: selectedLat,
        lng: selectedLng,
        altitude: 1.75,
        countryName: selectedCountry?.featureName ?? selectedCountry?.name ?? null,
        time: performance.now()
      };
      setGlobeAltitude(1.75);
      globeRef.current.pointOfView(
        {
          lat: selectedLat,
          lng: selectedLng,
          altitude: 1.75
        },
        1200
      );
    }
  }, [isReady, selectedLat, selectedLng]);

  function getPolygonColor(feature) {
    if (!isCountryFeature(feature)) {
      return "rgba(255, 255, 255, 0)";
    }

    if (countryMatchesSelection(feature, selectedCountry)) {
      return "rgba(34, 197, 94, 0.54)";
    }

    return "rgba(255, 255, 255, 0.015)";
  }

  function selectFeature(feature) {
    if (!isCountryFeature(feature)) {
      return false;
    }

    countryClickGuardRef.current = true;
    onCountrySelect(feature);
    window.setTimeout(() => {
      countryClickGuardRef.current = false;
    }, 100);

    return true;
  }

  function toggleCities() {
    setCitiesEnabled((currentValue) => {
      const nextValue = !currentValue;

      if (!nextValue) {
        setSelectedCity(null);
      }

      return nextValue;
    });
  }

  function updateViewFromPointOfView(pointOfView) {
    const nextAltitude = pointOfView?.altitude ?? DEFAULT_GLOBE_ALTITUDE;
    const hasCoordinates =
      Number.isFinite(pointOfView?.lat) && Number.isFinite(pointOfView?.lng);
    const previousView = viewUpdateRef.current;
    const now = performance.now();
    const altitudeChanged = Math.abs(nextAltitude - previousView.altitude) >= 0.025;
    const centerMoved =
      hasCoordinates &&
      getCityDistanceFromCenter(pointOfView, previousView) >=
        getViewUpdateDistanceThreshold(nextAltitude);
    const shouldUpdateView =
      altitudeChanged ||
      centerMoved ||
      now - previousView.time >= VIEW_UPDATE_INTERVAL_MS;

    if (!shouldUpdateView) {
      return;
    }

    viewUpdateRef.current = {
      lat: hasCoordinates ? pointOfView.lat : previousView.lat,
      lng: hasCoordinates ? pointOfView.lng : previousView.lng,
      altitude: nextAltitude,
      countryName: previousView.countryName,
      time: now
    };

    setGlobeAltitude((currentAltitude) =>
      Math.abs(currentAltitude - nextAltitude) >= 0.015 ? nextAltitude : currentAltitude
    );

    if (!hasCoordinates) {
      viewUpdateRef.current.countryName = null;
      setViewCountryName(null);
      return;
    }

    if (!centerMoved && previousView.countryName) {
      return;
    }

    const countryAtViewCenter = findCountryAtCoordinates(pointOfView, countries);
    const nextCountryName = countryAtViewCenter ? getCountryName(countryAtViewCenter) : null;

    viewUpdateRef.current.countryName = nextCountryName;
    setViewCountryName((currentCountryName) =>
      currentCountryName === nextCountryName ? currentCountryName : nextCountryName
    );
  }

  function createCityElement(city) {
    const element = document.createElement("button");
    const isSelected = selectedCity?.id === city.id;

    element.type = "button";
    element.className = `city-map-label ${getCityImportanceClass(city)}${
      isSelected ? " is-selected" : ""
    }`;
    element.title = `${city.name} - ${city.country}`;
    element.setAttribute("aria-label", `${city.name}, ${city.country}`);
    element.style.color = city.color;
    element.style.pointerEvents = "auto";
    element.innerHTML = `<span class="city-map-label-dot"></span><span class="city-map-label-text">${escapeHtml(
      city.name
    )}</span>`;

    element.addEventListener("click", (event) => {
      event.stopPropagation();
      countryClickGuardRef.current = true;
      setSelectedCity(city);
      window.setTimeout(() => {
        countryClickGuardRef.current = false;
      }, 100);
    });

    return element;
  }

  return (
    <div className="globe-stage" ref={containerRef}>
      <div className="globe-canvas">
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          rendererConfig={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          animateIn={false}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={earthTexture}
          showAtmosphere
          atmosphereColor="#38bdf8"
          atmosphereAltitude={0.08}
          polygonsData={countries}
          polygonCapColor={getPolygonColor}
          polygonCapCurvatureResolution={1}
          polygonSideColor={() => "rgba(0, 0, 0, 0)"}
          polygonStrokeColor={(feature) => {
            if (countryMatchesSelection(feature, selectedCountry)) {
              return "rgba(187, 247, 208, 0.95)";
            }

            return "rgba(255, 255, 255, 0.14)";
          }}
          polygonAltitude={(feature) => {
            if (countryMatchesSelection(feature, selectedCountry)) {
              return 0.018;
            }

            return 0;
          }}
          polygonLabel={(feature) =>
            isCountryFeature(feature)
              ? `<div class="globe-tooltip"><strong>${escapeHtml(
                  getCountryName(feature)
                )}</strong></div>`
              : ""
          }
          polygonsTransitionDuration={0}
          onPolygonClick={(feature, event, coords) => {
            if (!isCountryFeature(feature)) {
              return;
            }

            const countryAtClick = coords ? findCountryAtCoordinates(coords, countries) : null;

            if (coords && !countryAtClick) {
              return;
            }

            event?.stopPropagation?.();
            selectFeature(countryAtClick ?? feature);
          }}
          onGlobeClick={(coords) => {
            if (countryClickGuardRef.current) {
              return;
            }

            const countryAtClick = findCountryAtCoordinates(coords, countries);

            if (!selectFeature(countryAtClick)) {
              onClearSelection();
            }
          }}
          labelsData={waterLabelData}
          labelLat={(label) => label.lat}
          labelLng={(label) => label.lng}
          labelText={(label) => label.name}
          labelAltitude={0.025}
          labelSize={(label) => (label.type === "oc\u00e9an" ? 1.15 : 0.85)}
          labelIncludeDot
          labelDotRadius={0.24}
          labelDotOrientation="bottom"
          labelColor={(label) => label.color}
          labelResolution={1}
          labelsTransitionDuration={0}
          htmlElementsData={visibleCities}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={(city) => (selectedCity?.id === city.id ? 0.026 : 0.018)}
          htmlElement={createCityElement}
          htmlElementVisibilityModifier={(element, isVisible) => {
            element.style.opacity = isVisible ? "1" : "0";
            element.style.pointerEvents = isVisible ? "auto" : "none";
          }}
          htmlTransitionDuration={0}
          onZoom={updateViewFromPointOfView}
          onGlobeReady={() => setIsReady(true)}
        />
      </div>

      <div className="globe-controls" aria-label="Options du globe">
        <button
          className={`city-toggle${citiesEnabled ? " is-active" : ""}`}
          type="button"
          aria-pressed={citiesEnabled}
          onClick={toggleCities}
          title={
            cityLoadError ??
            (citiesEnabled
              ? "Zoomez très près d'un pays pour voir ses villes"
              : "Afficher les villes")
          }
        >
          <MapPin size={16} aria-hidden="true" />
          <span>{citiesLoading ? "Chargement..." : "Afficher les villes"}</span>
        </button>
      </div>

      {selectedCity ? (
        <aside className="city-card" aria-label="Fiche ville">
          <div className="city-card-heading">
            <div>
              <p>Ville sélectionnée</p>
              <h2>{selectedCity.name}</h2>
            </div>
            <button
              className="city-card-close"
              type="button"
              onClick={() => setSelectedCity(null)}
              aria-label="Fermer la fiche ville"
              title="Fermer"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <dl className="city-facts">
            <div>
              <dt>Pays</dt>
              <dd>{selectedCity.country}</dd>
            </div>
            <div>
              <dt>Population</dt>
              <dd>{formatPopulation(selectedCity.population)}</dd>
            </div>
            <div>
              <dt>Latitude</dt>
              <dd>{selectedCity.lat.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Longitude</dt>
              <dd>{selectedCity.lng.toFixed(4)}</dd>
            </div>
          </dl>

          <section className="city-weather" aria-live="polite">
            <h3>Météo actuelle</h3>

            {cityWeatherLoading ? (
              <p>Chargement de la météo...</p>
            ) : cityWeatherError ? (
              <p>{cityWeatherError}</p>
            ) : cityWeather ? (
              <dl className="weather-facts">
                <div>
                  <dt>Condition</dt>
                  <dd>{cityWeather.condition}</dd>
                </div>
                <div>
                  <dt>Température</dt>
                  <dd>
                    {formatWeatherValue(
                      cityWeather.temperature,
                      cityWeather.units.temperature
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Humidité</dt>
                  <dd>{formatWeatherValue(cityWeather.humidity, cityWeather.units.humidity)}</dd>
                </div>
                <div>
                  <dt>Vent</dt>
                  <dd>{formatWeatherValue(cityWeather.windSpeed, cityWeather.units.windSpeed)}</dd>
                </div>
              </dl>
            ) : (
              <p>Météo indisponible pour le moment.</p>
            )}
          </section>
        </aside>
      ) : null}

      <p className="globe-hint">
        Faites tourner la planète, suivez la Lune, le Soleil et cliquez sur un pays.
      </p>
    </div>
  );
}
