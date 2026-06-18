import { Search, X } from "lucide-react";
import { useId, useState } from "react";
import { countriesInfo as defaultCountriesInfo } from "../data/countries-info.js";
import { matchCountryBySearch } from "../utils/countryHelpers.js";

export default function SearchBar({
  countries = [],
  countriesInfo = defaultCountriesInfo,
  onCountrySearch
}) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const match = matchCountryBySearch(query, countriesInfo, countries);

    if (!match) {
      setMessage("Aucun pays trouvé pour cette recherche.");
      return;
    }

    setMessage("");
    setQuery(match.info?.name ?? match.name);
    onCountrySearch(match);
  }

  function handleClear() {
    setQuery("");
    setMessage("");
  }

  return (
    <form className="search-area" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={inputId}>
        Rechercher un pays
      </label>
      <div className="search-control">
        <Search className="search-leading-icon" size={18} aria-hidden="true" />
        <input
          id={inputId}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (message) {
              setMessage("");
            }
          }}
          placeholder="Rechercher un pays..."
          autoComplete="off"
        />
        {query ? (
          <button
            className="icon-button search-clear"
            type="button"
            onClick={handleClear}
            aria-label="Effacer la recherche"
            title="Effacer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        ) : null}
        <button
          className="icon-button search-submit"
          type="submit"
          aria-label="Lancer la recherche"
          title="Rechercher"
        >
          <Search size={18} aria-hidden="true" />
        </button>
      </div>
      {message ? (
        <p className="search-message" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
