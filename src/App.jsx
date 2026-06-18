import { useCallback, useState } from "react";
import Header from "./components/Header.jsx";
import GlobeViewer from "./components/GlobeViewer.jsx";
import CountryPanel from "./components/CountryPanel.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import OceanLegend from "./components/OceanLegend.jsx";
import { countriesInfo } from "./data/countries-info.js";
import { waterLabels } from "./data/water-labels.js";
import { useCountries } from "./hooks/useCountries.js";
import {
  createFallbackCountryInfo,
  findCountryFeature,
  findCountryInfo,
  getCountryName,
  isCountryFeature
} from "./utils/countryHelpers.js";

function buildCountrySelection({ feature, name, info }) {
  const featureName = feature ? getCountryName(feature) : name;
  const countryInfo =
    info ?? findCountryInfo(featureName) ?? createFallbackCountryInfo(feature ?? featureName);
  const displayName = countryInfo?.name ?? featureName ?? name;

  return {
    name: displayName,
    featureName,
    info: countryInfo,
    lat: countryInfo?.lat,
    lng: countryInfo?.lng
  };
}

export default function App() {
  const { countries, isLoading, error } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = useCallback((feature) => {
    if (!isCountryFeature(feature)) {
      return;
    }

    setSelectedCountry(buildCountrySelection({ feature }));
  }, []);

  const handleCountrySearch = useCallback(
    (match) => {
      if (!match) {
        return;
      }

      const feature =
        match.feature ??
        findCountryFeature(match.info?.name ?? match.name, countries) ??
        findCountryFeature(match.name, countries);

      setSelectedCountry(
        buildCountrySelection({
          feature,
          name: match.name,
          info: match.info
        })
      );
    },
    [countries]
  );

  return (
    <div className="app-shell">
      <Header
        countries={countries}
        countriesInfo={countriesInfo}
        onCountrySearch={handleCountrySearch}
      />

      <main className="app-main">
        <section className="globe-zone" aria-label="Globe terrestre interactif">
          {isLoading ? (
            <LoadingScreen />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <GlobeViewer
              countries={countries}
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
              onClearSelection={() => {
                setSelectedCountry(null);
              }}
            />
          )}
        </section>

        <aside className="side-rail" aria-label="Informations géographiques">
          <CountryPanel
            country={selectedCountry}
            onClose={() => setSelectedCountry(null)}
          />
          <OceanLegend labels={waterLabels} />
        </aside>
      </main>
    </div>
  );
}
