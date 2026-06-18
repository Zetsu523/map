import { useEffect, useState } from "react";
import countriesGeojsonUrl from "../data/countries.geojson?url";

export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(countriesGeojsonUrl, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Le fichier GeoJSON des pays est introuvable.");
        }

        const geojson = await response.json();

        if (!geojson || !Array.isArray(geojson.features)) {
          throw new Error("Le fichier GeoJSON ne contient pas de collection de pays valide.");
        }

        setCountries(geojson.features);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message ?? "Une erreur est survenue pendant le chargement des pays.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCountries();

    return () => controller.abort();
  }, []);

  return { countries, isLoading, error };
}
