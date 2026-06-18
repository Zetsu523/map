import { Waves } from "lucide-react";

export default function OceanLegend({ labels }) {
  return (
    <section className="ocean-legend">
      <div className="legend-heading">
        <Waves size={19} aria-hidden="true" />
        <h2>Mers et océans</h2>
      </div>
      <ul>
        {labels.map((label) => (
          <li key={`${label.name}-${label.lat}-${label.lng}`}>
            <span className={`legend-dot legend-dot-${label.type}`} />
            <span>{label.name}</span>
          </li>
        ))}
      </ul>
      <p>Les fiches dédiées aux mers et océans sont prévues après la V1.</p>
    </section>
  );
}
