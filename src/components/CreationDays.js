"use client";
import { useEffect, useState } from "react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = [
  {
    n: 1, title: "La luz", ref: "Génesis 1:3-5",
    items: ["Dios habla y aparece la luz", "Separa la luz de las tinieblas", "Llama «día» a la luz y «noche» a las tinieblas"],
    seal: "Vio Dios que la luz era buena", note: null,
  },
  {
    n: 2, title: "El cielo", ref: "Génesis 1:6-8",
    items: ["Crea una expansión en medio de las aguas", "Separa las aguas de abajo de las de arriba", "A esa expansión la llama «cielos»"],
    seal: null, note: "Fíjense: es el único de los seis días donde no aparece «vio Dios que era bueno».",
  },
  {
    n: 3, title: "Tierra, mares y plantas", ref: "Génesis 1:9-13",
    items: ["Reúne las aguas y aparece lo seco", "Llama «tierra» a lo seco y «mares» a las aguas", "La tierra produce hierba, plantas con semilla y árboles de fruto"],
    seal: "Lo vio bueno, dos veces en este mismo día", note: null,
  },
  {
    n: 4, title: "Sol, luna y estrellas", ref: "Génesis 1:14-19",
    items: ["Pone lumbreras en el cielo: una mayor para el día y una menor para la noche", "También hace las estrellas", "Sirven de señales para las estaciones, los días y los años"],
    seal: "Vio Dios que era bueno", note: null,
  },
  {
    n: 5, title: "Peces y aves", ref: "Génesis 1:20-23",
    items: ["Llena las aguas de seres vivos: peces y grandes criaturas marinas", "Llena el cielo de aves", "Los bendice para que se multipliquen"],
    seal: "Vio Dios que era bueno", note: null,
  },
  {
    n: 6, title: "Animales y personas", ref: "Génesis 1:24-31",
    items: ["Crea los animales de la tierra: ganado, reptiles y fieras", "Crea al ser humano, hombre y mujer, a su imagen", "Les encarga cuidar y gobernar la creación", "Les da las plantas como alimento"],
    seal: "Al final de este día: bueno en gran manera", note: null,
  },
  {
    n: 7, title: "El descanso", ref: "Génesis 2:1-3",
    items: ["Dios termina su obra", "Descansa de todo lo que hizo", "Bendice el séptimo día y lo declara santo"],
    seal: "Lo bendijo y lo santificó", note: "Es el único día sin la fórmula «fue la tarde y la mañana»: el relato lo deja abierto.",
  },
];

const BG = {
  1: "radial-gradient(circle at 50% 42%, #fff4b8 0%, #6d7bd1 38%, #121a4a 75%, #070b24 100%)",
  2: "linear-gradient(180deg,#18265c 0%,#4a86c5 100%)",
  3: "linear-gradient(180deg,#2c4f92 0%,#86bae8 100%)",
  4: "linear-gradient(180deg,#1b2766 0%,#7b6bb5 45%,#f6b8a0 100%)",
  5: "linear-gradient(180deg,#5fb4ec 0%,#e3f4ff 100%)",
  6: "linear-gradient(180deg,#5fb4ec 0%,#e3f4ff 100%)",
  7: "linear-gradient(180deg,#ffe29a 0%,#fff6dc 100%)",
};

function E({ c, style, delay = 0, anim, size = 30 }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        lineHeight: 1,
        fontSize: size,
        animation: `fadeOnly .9s ease ${delay}s both${anim ? ", " + anim : ""}`,
        ...style,
      }}
    >
      {c}
    </span>
  );
}

function Scene({ day }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-line"
      style={{ aspectRatio: "16 / 10", background: BG[day], transition: "background 1s ease" }}
      role="img"
      aria-label={`Escena del día ${day} de la creación`}
    >
      <span
        className="absolute left-2.5 top-2.5 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
        style={{ background: "rgba(0,0,0,.4)" }}
      >
        Día {day}
      </span>

      {day === 1 && (
        <div style={{ position: "absolute", left: "50%", top: "42%", width: "46%", aspectRatio: "1", transform: "translate(-50%,-50%)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle,#fffbe0 0%,rgba(255,236,150,.5) 45%,transparent 70%)", animation: "glow 3s ease-in-out infinite" }} />
        </div>
      )}

      {day >= 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "36%", background: "linear-gradient(180deg,#3f8fd6,#1c5ea8)", animation: "fadeOnly 1s both" }} />
      )}
      {day >= 3 && (
        <div style={{ position: "absolute", left: "-8%", bottom: 0, width: "68%", height: "34%", borderRadius: "55% 45% 0 0 / 100% 100% 0 0", background: "linear-gradient(180deg,#5cb85c,#2f8f46)", animation: "fadeOnly 1s both" }} />
      )}

      {day >= 2 && (
        <>
          <E c="☁️" style={{ left: "12%", top: "10%" }} anim="drift 9s ease-in-out infinite alternate" size={34} />
          <E c="☁️" style={{ right: "14%", top: "22%" }} delay={0.3} anim="drift 11s ease-in-out infinite alternate" size={28} />
        </>
      )}

      {day >= 3 && (
        <>
          <E c="🌴" style={{ left: "4%", bottom: "28%", transformOrigin: "50% 100%" }} anim="sway 4s ease-in-out infinite" size={34} />
          <E c="🌳" style={{ left: "16%", bottom: "28%", transformOrigin: "50% 100%" }} delay={0.2} anim="sway 5s ease-in-out infinite" size={34} />
          <E c="🌿" style={{ left: "46%", bottom: "26%", transformOrigin: "50% 100%" }} delay={0.4} anim="sway 3.5s ease-in-out infinite" />
          <E c="🌱" style={{ left: "55%", bottom: "22%", transformOrigin: "50% 100%" }} delay={0.6} anim="sway 3s ease-in-out infinite" size={26} />
        </>
      )}

      {day >= 4 && (
        <>
          <E c="☀️" style={{ right: "9%", top: "8%" }} anim="bob 4s ease-in-out infinite" size={46} />
          <E c="🌙" style={{ left: "10%", top: "14%" }} delay={0.3} anim="bob 5s ease-in-out infinite" size={34} />
          <E c="✨" style={{ left: "38%", top: "10%" }} delay={0.5} anim="twinkle 2.2s ease-in-out infinite" size={20} />
          <E c="✨" style={{ left: "58%", top: "20%" }} delay={0.8} anim="twinkle 2.8s ease-in-out infinite" size={16} />
          <E c="✨" style={{ left: "26%", top: "26%" }} delay={1} anim="twinkle 2.5s ease-in-out infinite" size={14} />
        </>
      )}

      {day >= 5 && (
        <>
          <E c="🐟" style={{ right: "14%", bottom: "17%" }} anim="bob 3s ease-in-out infinite" />
          <E c="🐋" style={{ right: "38%", bottom: "5%" }} delay={0.3} anim="bob 4s ease-in-out infinite" size={38} />
          <E c="🐠" style={{ right: "6%", bottom: "6%" }} delay={0.5} anim="bob 3.4s ease-in-out infinite" size={24} />
          <E c="🦅" style={{ left: "40%", top: "28%" }} delay={0.2} anim="drift 7s ease-in-out infinite alternate" />
          <E c="🕊️" style={{ left: "60%", top: "40%" }} delay={0.6} anim="drift 8s ease-in-out infinite alternate" size={26} />
        </>
      )}

      {day >= 6 && (
        <>
          <E c="🦁" style={{ left: "6%", bottom: "6%" }} anim="bob 3.6s ease-in-out infinite" />
          <E c="🐘" style={{ left: "24%", bottom: "5%" }} delay={0.2} anim="bob 4.2s ease-in-out infinite" size={36} />
          <E c="🐑" style={{ left: "42%", bottom: "8%" }} delay={0.4} anim="bob 3.2s ease-in-out infinite" size={26} />
          <E c="👫" style={{ left: "29%", bottom: "30%" }} delay={0.7} anim="bob 3s ease-in-out infinite" size={36} />
        </>
      )}

      {day === 7 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,.6), transparent 62%)", animation: "fadeOnly 1.2s both" }} />
          <E c="🕊️" style={{ left: "46%", top: "26%" }} anim="bob 3s ease-in-out infinite" size={52} />
          <E c="✨" style={{ left: "30%", top: "20%" }} delay={0.4} anim="twinkle 2.4s ease-in-out infinite" size={22} />
          <E c="✨" style={{ left: "68%", top: "30%" }} delay={0.9} anim="twinkle 2.9s ease-in-out infinite" size={18} />
          <span
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "rgba(255,255,255,.75)", color: "#7a5a00", animation: "riseIn .8s ease .5s both" }}
          >
            Día de reposo
          </span>
        </>
      )}
    </div>
  );
}

export default function CreationDays() {
  const [day, setDay] = useState(1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (day < 7) setDay(day + 1);
      else setPlaying(false);
    }, 4500);
    return () => clearTimeout(t);
  }, [playing, day]);

  const d = DAYS[day - 1];

  function togglePlay() {
    if (playing) return setPlaying(false);
    if (day === 7) setDay(1);
    setPlaying(true);
  }

  return (
    <section className="card p-4">
      <h2 className="heading text-lg font-semibold">Los siete días de la creación</h2>
      <p className="mb-3 text-sm text-muted">Toquen cada día o den a reproducir: la escena va sumando lo que Dios hizo.</p>

      <Scene day={day} />

      <div className="mt-3 flex items-center justify-between gap-1">
        <button onClick={() => { setPlaying(false); setDay(Math.max(1, day - 1)); }} disabled={day === 1} className="rounded-full p-2 text-muted disabled:opacity-30" aria-label="Día anterior">
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-1.5">
          {DAYS.map((x) => (
            <button
              key={x.n}
              onClick={() => { setPlaying(false); setDay(x.n); }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition"
              style={
                x.n === day
                  ? { background: "var(--brand)", color: "var(--bg)" }
                  : x.n < day
                  ? { background: "color-mix(in srgb, var(--accent) 30%, transparent)", color: "var(--accent)" }
                  : { border: "1px solid var(--line)", color: "var(--muted)" }
              }
              aria-label={`Día ${x.n}`}
            >
              {x.n}
            </button>
          ))}
        </div>
        <button onClick={() => { setPlaying(false); setDay(Math.min(7, day + 1)); }} disabled={day === 7} className="rounded-full p-2 text-muted disabled:opacity-30" aria-label="Día siguiente">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-2 flex justify-center">
        <button onClick={togglePlay} className="btn-ghost !py-2">
          {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? "Pausar" : day === 7 ? "Ver de nuevo" : "Reproducir"}
        </button>
      </div>

      <div key={day} className="mt-4" style={{ animation: "riseIn .5s ease both" }}>
        <p className="eyebrow">Día {d.n} · {d.ref}</p>
        <h3 className="heading text-xl font-semibold">{d.title}</h3>
        <ul className="mt-2 space-y-1.5 text-sm">
          {d.items.map((it) => (
            <li key={it} className="flex gap-2">
              <span className="text-accent">•</span>
              <span className="text-muted">{it}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {d.seal && <span className="rounded-full px-3 py-1 font-medium" style={{ background: "color-mix(in srgb, var(--accent) 18%, transparent)", color: "var(--accent)" }}>✓ {d.seal}</span>}
          {d.n < 7 && <span className="rounded-full border border-line px-3 py-1 text-muted">«Fue la tarde y la mañana»: termina el día {d.n}</span>}
        </div>
        {d.note && <p className="mt-2 text-xs italic text-muted">{d.note}</p>}
      </div>

      <p className="mt-4 rounded-xl border border-line p-3 text-xs leading-relaxed text-muted">
        Un detalle que muchos estudiosos notan: los días 1 al 3 dan forma y los días 4 al 6 llenan.
        La luz (día 1) se llena con sol, luna y estrellas (día 4); el cielo y el mar (día 2) con aves y peces (día 5);
        y la tierra con sus plantas (día 3) con animales y personas (día 6).
      </p>
    </section>
  );
}