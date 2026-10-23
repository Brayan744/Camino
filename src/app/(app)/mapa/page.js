import { PLACES, ROUTE } from "@/data/places";

export const metadata = { title: "Mapa · Camino de la Palabra" };

export default function Mapa() {
  const byId = Object.fromEntries(PLACES.map((p) => [p.id, p]));
  const route = ROUTE.map((id) => `${byId[id].x},${byId[id].y}`).join(" ");
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Mapa</p>
        <h1 className="heading text-3xl font-semibold">Del Edén a las puertas de Canaán</h1>
        <p className="mt-3 text-muted">
          Un mapa esquemático (no a escala) de los lugares del Pentateuco. La línea punteada sigue el recorrido de Ur a Moab.
        </p>
      </div>

      <svg viewBox="0 0 900 500" className="w-full rounded-xl2 border border-line" style={{ background: "var(--surface)" }} role="img" aria-label="Mapa esquemático del Pentateuco">
        <path d="M0 0 H300 C285 70 255 130 240 200 C228 255 150 285 0 270 Z" fill="var(--sea)" />
        <text x="30" y="140" fontSize="15" fill="var(--muted)" fontStyle="italic">Mar Mediterráneo</text>
        <polyline points={route} fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="8 8" style={{ animation: "dashMove 4s linear infinite" }} strokeLinecap="round" strokeLinejoin="round" />
        {PLACES.map((p) => {
          const end = p.x > 650;
          return (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r="9" fill="var(--brand)" stroke="var(--surface)" strokeWidth="3" />
              <text x={end ? p.x - 16 : p.x + 16} y={p.y + 5} textAnchor={end ? "end" : "start"} fontSize="17" fontWeight="600" fill="var(--ink)">
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="space-y-3">
        {PLACES.map((p) => (
          <div key={p.id} className="card p-4">
            <p className="heading font-semibold">{p.name}</p>
            <p className="text-sm text-muted">{p.note}</p>
            <p className="mt-1 text-xs text-accent">{p.refs}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
