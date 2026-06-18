import { Globe2 } from "lucide-react";
import SearchBar from "./SearchBar.jsx";

export default function Header({ countries, countriesInfo, onCountrySearch }) {
  return (
    <header className="site-header">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">
          <Globe2 size={26} strokeWidth={2.2} />
        </span>
        <div className="brand-copy">
          <p className="eyebrow">V1 éducative</p>
          <h1>Globe Interactif 3D</h1>
          <p>Explorez la planète, découvrez les pays, mers et océans.</p>
        </div>
      </div>

      <SearchBar
        countries={countries}
        countriesInfo={countriesInfo}
        onCountrySearch={onCountrySearch}
      />
    </header>
  );
}
