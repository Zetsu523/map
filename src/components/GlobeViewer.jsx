import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { waterLabels } from "../data/water-labels.js";
import {
  countryMatchesSelection,
  findCountryAtCoordinates,
  getCountryName,
  isCountryFeature
} from "../utils/countryHelpers.js";

const MIN_GLOBE_SIZE = 320;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  const countryClickGuardRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const size = useElementSize(containerRef);

  const selectedLat = selectedCountry?.lat;
  const selectedLng = selectedCountry?.lng;
  const earthTexture = `${import.meta.env.BASE_URL}textures/earth-blue-marble.jpg`;

  const labelData = useMemo(
    () =>
      waterLabels.map((label) => ({
        ...label,
        color: label.type === "mer" ? "#a7f3d0" : "#bae6fd"
      })),
    []
  );

  useEffect(() => {
    if (!isReady || !globeRef.current) {
      return;
    }

    const controls = globeRef.current.controls();

    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.55;
      controls.zoomSpeed = 0.75;
      controls.minDistance = 150;
      controls.maxDistance = 560;
      controls.autoRotate = false;
    }
  }, [isReady]);

  useEffect(() => {
    if (!isReady || !globeRef.current) {
      return;
    }

    if (Number.isFinite(selectedLat) && Number.isFinite(selectedLng)) {
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

  return (
    <div className="globe-stage" ref={containerRef}>
      <div className="globe-canvas">
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          rendererConfig={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          animateIn={false}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={earthTexture}
          showAtmosphere
          atmosphereColor="#38bdf8"
          atmosphereAltitude={0.08}
          polygonsData={countries}
          polygonCapColor={getPolygonColor}
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
          labelsData={labelData}
          labelLat={(label) => label.lat}
          labelLng={(label) => label.lng}
          labelText={(label) => label.name}
          labelAltitude={0.025}
          labelSize={(label) => (label.type === "oc\u00e9an" ? 1.15 : 0.85)}
          labelDotRadius={0.24}
          labelColor={(label) => label.color}
          labelResolution={1}
          onGlobeReady={() => setIsReady(true)}
        />
      </div>

      <p className="globe-hint">
        Faites tourner la plan\u00e8te et cliquez sur un pays pour en savoir plus.
      </p>
    </div>
  );
}
