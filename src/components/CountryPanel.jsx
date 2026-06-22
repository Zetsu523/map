import { Landmark, MapPin, MoveDiagonal, Users, X } from "lucide-react";

function formatValue(value) {
  return value || "Non renseigné";
}

export default function CountryPanel({ country, onClose }) {
  const info = country?.info;
  const name = info?.name ?? country?.name;

  if (!country) {
    return (
      <section className="country-panel country-panel-empty">
        <p className="panel-kicker">Pays sélectionné</p>
        <h2>Aucune sélection</h2>
        <p>
          Cliquez sur un pays ou utilisez la recherche pour afficher une fiche
          d'information.
        </p>
      </section>
    );
  }

  const facts = [
    {
      label: "Continent",
      value: formatValue(info?.continent),
      icon: <MapPin size={18} aria-hidden="true" />
    },
    ...(info?.euStatus
      ? [
          {
            label: "Union européenne",
            value: info.euStatus,
            icon: <Landmark size={18} aria-hidden="true" />
          }
        ]
      : []),
    {
      label: "Capitale",
      value: formatValue(info?.capital),
      icon: <Landmark size={18} aria-hidden="true" />
    },
    {
      label: "Population",
      value: formatValue(info?.population),
      icon: <Users size={18} aria-hidden="true" />
    },
    {
      label: "Superficie",
      value: formatValue(info?.area),
      icon: <MoveDiagonal size={18} aria-hidden="true" />
    }
  ];

  return (
    <section className="country-panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">Fiche pays</p>
          <h2>{name}</h2>
        </div>
        <button
          className="icon-button panel-close"
          type="button"
          onClick={onClose}
          aria-label="Fermer la fiche pays"
          title="Fermer"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <dl className="country-facts">
        {facts.map((fact) => (
          <div className="country-fact" key={fact.label}>
            <dt>
              {fact.icon}
              <span>{fact.label}</span>
            </dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="country-description">
        <p>{info?.description ?? "Aucune description détaillée n'est disponible pour ce pays en V1."}</p>
      </div>
    </section>
  );
}
