"use client";
import { useEffect, useState } from "react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

const CSS = `
@keyframes sc-rain{0%{transform:translateY(-20px);opacity:0}10%{opacity:1}100%{transform:translateY(260px);opacity:0}}
@keyframes sc-bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-4px) rotate(2deg)}}
@keyframes sc-wave{from{background-position:0 0}to{background-position:40px 0}}
@keyframes sc-pop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.2);opacity:1}100%{transform:scale(1)}}
@keyframes sc-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes sc-pulse{0%,100%{opacity:.5}50%{opacity:1}}
`;

function useSteps(n, ms = 4200) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (i < n - 1) setI(i + 1);
      else setPlaying(false);
    }, ms);
    return () => clearTimeout(t);
  }, [playing, i, n, ms]);
  return {
    i,
    playing,
    go: (k) => { setPlaying(false); setI(Math.max(0, Math.min(n - 1, k))); },
    toggle: () => {
      if (playing) return setPlaying(false);
      if (i === n - 1) setI(0);
      setPlaying(true);
    },
  };
}

function Controls({ n, s }) {
  return (
    <>
      <div className="mt-3 flex items-center justify-between gap-1">
        <button onClick={() => s.go(s.i - 1)} disabled={s.i === 0} className="rounded-full p-2 text-muted disabled:opacity-30" aria-label="Anterior">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-wrap justify-center gap-1.5">
          {Array.from({ length: n }, (_, k) => (
            <button
              key={k}
              onClick={() => s.go(k)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition"
              style={
                k === s.i
                  ? { background: "var(--brand)", color: "var(--bg)" }
                  : k < s.i
                  ? { background: "color-mix(in srgb, var(--accent) 30%, transparent)", color: "var(--accent)" }
                  : { border: "1px solid var(--line)", color: "var(--muted)" }
              }
              aria-label={`Paso ${k + 1}`}
            >
              {k + 1}
            </button>
          ))}
        </div>
        <button onClick={() => s.go(s.i + 1)} disabled={s.i === n - 1} className="rounded-full p-2 text-muted disabled:opacity-30" aria-label="Siguiente">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="mt-2 flex justify-center">
        <button onClick={s.toggle} className="btn-ghost !py-2">
          {s.playing ? <Pause size={16} /> : <Play size={16} />} {s.playing ? "Pausar" : s.i === n - 1 ? "Ver de nuevo" : "Reproducir"}
        </button>
      </div>
    </>
  );
}

function Shell({ title, hint, children }) {
  return (
    <section className="card p-4">
      <style>{CSS}</style>
      <h2 className="heading text-lg font-semibold">{title}</h2>
      <p className="mb-3 text-sm text-muted">{hint}</p>
      {children}
    </section>
  );
}

function Info({ k, eyebrow, title, text }) {
  return (
    <div key={k} className="mt-4" style={{ animation: "sc-in .45s ease both" }}>
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="heading text-xl font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

/* ---------------- Diluvio ---------------- */

const FLOOD = [
  { t: "Entran al arca", ref: "Génesis 7:7", level: 10, rain: false, note: "Noé, su esposa, sus tres hijos y las esposas de ellos entran al arca por causa de las aguas del diluvio, junto con los animales." },
  { t: "Empieza a llover", ref: "Génesis 7:11-12", level: 32, rain: true, note: "Se rompen las fuentes del gran abismo y se abren las ventanas de los cielos. Llovió cuarenta días y cuarenta noches." },
  { t: "Dios cierra la puerta", ref: "Génesis 7:16", level: 45, rain: true, note: "Quien cierra la puerta del arca es Jehová mismo: Noé queda guardado por Dios, no solo por su obra." },
  { t: "Las aguas cubren los montes", ref: "Génesis 7:19-20", level: 86, rain: true, note: "Las aguas subieron quince codos por encima de los montes más altos. El relato insiste en que fue total." },
  { t: "Ciento cincuenta días", ref: "Génesis 7:24", level: 88, rain: false, note: "Las aguas prevalecieron sobre la tierra ciento cincuenta días. Pero el capítulo siguiente empieza con una frase de esperanza: Dios se acordó de Noé." },
];

function Ark({ w = 82 }) {
  return (
    <svg width={w} viewBox="0 0 120 70" aria-hidden="true">
      <path d="M6 36h108l-14 26a8 8 0 0 1-7 4H27a8 8 0 0 1-7-4z" fill="#8b5a2b" />
      <rect x="28" y="14" width="64" height="24" rx="3" fill="#a9733a" />
      <path d="M22 16L60 2l38 14z" fill="#6f4520" />
      <rect x="54" y="22" width="12" height="16" rx="2" fill="#4b2e12" />
      <path d="M6 36h108" stroke="#5a3a18" strokeWidth="3" />
    </svg>
  );
}

export function Flood() {
  const s = useSteps(FLOOD.length, 4500);
  const st = FLOOD[s.i];
  return (
    <Shell title="El diluvio paso a paso" hint="Toca los pasos o dale a reproducir para ver cómo suben las aguas.">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-line"
        style={{
          aspectRatio: "16 / 10",
          background: st.rain ? "linear-gradient(180deg,#2b3350,#6c7a99)" : "linear-gradient(180deg,#8fb8e8,#dbeaf7)",
          transition: "background 1.2s ease",
        }}
        role="img"
        aria-label={`Escena del diluvio: ${st.t}`}
      >
        <div style={{ position: "absolute", left: "6%", bottom: 0, width: "34%", height: "62%", background: "#7d7a74", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
        <div style={{ position: "absolute", right: "4%", bottom: 0, width: "40%", height: "76%", background: "#8c8880", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
        {st.rain &&
          Array.from({ length: 26 }, (_, k) => (
            <span
              key={k}
              style={{
                position: "absolute", top: 0, left: `${(k * 37) % 100}%`, width: 2, height: 14, borderRadius: 2,
                background: "rgba(255,255,255,.65)",
                animation: `sc-rain ${0.9 + (k % 5) * 0.18}s linear ${(k % 7) * 0.12}s infinite`,
              }}
            />
          ))}
        <div
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: st.level + "%",
            background: "linear-gradient(180deg,#4d8fd1,#1b4f94)", transition: "height 2.4s ease",
          }}
        >
          <div
            style={{
              height: 6, marginTop: -3,
              backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.45) 0 10px, transparent 10px 20px)",
              animation: "sc-wave 2s linear infinite",
            }}
          />
        </div>
        <div style={{ position: "absolute", left: "50%", bottom: `calc(${st.level}% - 12px)`, transform: "translateX(-50%)", transition: "bottom 2.4s ease" }}>
          <div style={{ animation: "sc-bob 3s ease-in-out infinite" }}><Ark /></div>
        </div>
      </div>
      <Controls n={FLOOD.length} s={s} />
      <Info k={s.i} eyebrow={`Paso ${s.i + 1} de ${FLOOD.length} · ${st.ref}`} title={st.t} text={st.note} />
    </Shell>
  );
}

/* ---------------- Mar Rojo ---------------- */

const RS = [
  { t: "Atrapados", ref: "Éxodo 14:9-12", open: 0, you: 6, egy: 2, egyOp: 1, cloud: true, note: "Israel acampa junto al mar y ve venir a los egipcios. El pueblo se asusta y reclama a Moisés. Entre los dos campamentos se interpone la columna de nube." },
  { t: "Dios abre el mar", ref: "Éxodo 14:21", open: 14, you: 6, egy: 2, egyOp: 1, cloud: true, note: "Moisés extiende su mano y Jehová hace retroceder el mar con un fuerte viento oriental toda aquella noche." },
  { t: "Cruzan en seco", ref: "Éxodo 14:22", open: 14, you: 50, egy: 26, egyOp: 1, cloud: false, note: "Los israelitas pasan por en medio del mar, con las aguas como muro a su derecha y a su izquierda." },
  { t: "Las aguas regresan", ref: "Éxodo 14:26-28", open: 0, you: 84, egy: 50, egyOp: 0.35, cloud: false, note: "Al amanecer el mar vuelve a su lugar y cubre los carros y la caballería de Faraón." },
  { t: "Israel cree", ref: "Éxodo 14:30-31", open: 0, you: 84, egy: 50, egyOp: 0, cloud: false, note: "Israel ve la mano poderosa de Dios, lo teme y cree en él y en su siervo Moisés." },
];

export function RedSea() {
  const s = useSteps(RS.length, 4500);
  const st = RS[s.i];
  const wall = 22 - st.open / 2;
  const wallStyle = {
    position: "absolute", top: "42%", bottom: 0, transition: "width 2s ease",
    background: "linear-gradient(180deg,#3d86cf,#164a8c)", overflow: "hidden",
  };
  return (
    <Shell title="El cruce del mar Rojo" hint="Sigue el cruce paso a paso: cómo se abrió el mar y cómo volvió a cerrarse.">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-line"
        style={{ aspectRatio: "16 / 10", background: "linear-gradient(180deg,#8fc4f0,#e9f4fb)" }}
        role="img"
        aria-label={`Escena del mar Rojo: ${st.t}`}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: "42%", bottom: 0, background: "#d8c28a" }} />
        <div style={{ position: "absolute", left: "28%", right: "28%", top: "42%", bottom: 0, background: "#b9a06a" }} />
        <div style={{ ...wallStyle, left: "28%", width: wall + "%" }}>
          <div style={{ height: 6, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.4) 0 10px, transparent 10px 20px)", animation: "sc-wave 2s linear infinite" }} />
        </div>
        <div style={{ ...wallStyle, right: "28%", width: wall + "%" }}>
          <div style={{ height: 6, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.4) 0 10px, transparent 10px 20px)", animation: "sc-wave 2s linear infinite" }} />
        </div>
        {st.cloud && <span style={{ position: "absolute", left: "17%", top: "20%", fontSize: 34, animation: "sc-pulse 3s ease-in-out infinite" }}>☁️</span>}
        <span style={{ position: "absolute", left: `${st.egy}%`, bottom: "16%", fontSize: 28, opacity: st.egyOp, transition: "left 3s linear, opacity 1.5s ease" }}>🐎</span>
        {st.egyOp < 1 && st.egyOp > 0 && <span style={{ position: "absolute", left: "47%", bottom: "26%", fontSize: 30, animation: "sc-pop .6s ease both" }}>🌊</span>}
        <span style={{ position: "absolute", left: `${st.you}%`, bottom: "16%", fontSize: 24, transition: "left 3s linear", whiteSpace: "nowrap" }}>🚶‍♂️🚶‍♀️🐑</span>
        {s.i === 4 && <span style={{ position: "absolute", left: "80%", bottom: "42%", fontSize: 26, animation: "sc-pop .6s ease both" }}>🙌</span>}
      </div>
      <Controls n={RS.length} s={s} />
      <Info k={s.i} eyebrow={`Paso ${s.i + 1} de ${RS.length} · ${st.ref}`} title={st.t} text={st.note} />
    </Shell>
  );
}

/* ---------------- Plagas ---------------- */

const PLAGUES = [
  { n: 1, e: "🩸", name: "El agua en sangre", ref: "Éxodo 7:14-25", text: "El Nilo y todas las aguas de Egipto se vuelven sangre. Los magos de Faraón logran imitarlo a pequeña escala, pero no pueden revertirlo.", god: "el Nilo, fuente de vida de Egipto y objeto de culto." },
  { n: 2, e: "🐸", name: "Las ranas", ref: "Éxodo 8:1-15", text: "Las ranas cubren casas, camas y hornos. Faraón pide que Moisés ore para quitarlas y promete dejar ir al pueblo, pero en cuanto hay alivio se arrepiente.", god: "Heqet, diosa egipcia representada con cabeza de rana." },
  { n: 3, e: "🦟", name: "Los piojos", ref: "Éxodo 8:16-19", text: "El polvo de la tierra se convierte en piojos (algunos traducen mosquitos). Esta vez los magos no pueden imitarlo y reconocen que es «dedo de Dios».", god: "la tierra, vinculada por algunos al dios Geb." },
  { n: 4, e: "🪰", name: "Las moscas", ref: "Éxodo 8:20-32", text: "Enjambres de moscas invaden Egipto, pero Gosén queda libre. Desde aquí el texto marca una diferencia clara entre Egipto y el pueblo de Dios.", god: "algunos lo relacionan con Khepri, dios con forma de escarabajo." },
  { n: 5, e: "🐄", name: "La peste del ganado", ref: "Éxodo 9:1-7", text: "Muere el ganado de los egipcios, pero no muere ninguno de los animales de Israel.", god: "Apis y Hathor, toros y vacas sagrados." },
  { n: 6, e: "🤕", name: "Las úlceras", ref: "Éxodo 9:8-12", text: "Moisés lanza ceniza de horno al aire y salen úlceras en personas y animales. Los magos ni siquiera pueden presentarse delante de Moisés.", god: "dioses de la sanación, como Sekhmet o Imhotep." },
  { n: 7, e: "⛈️", name: "El granizo", ref: "Éxodo 9:13-35", text: "Truenos, granizo y fuego caen sobre Egipto. Algunos egipcios ya temen la palabra de Dios y ponen a salvo a sus siervos y ganados.", god: "Nut, diosa del cielo, y Seth, dios de las tormentas." },
  { n: 8, e: "🦗", name: "Las langostas", ref: "Éxodo 10:1-20", text: "Las langostas devoran lo poco que dejó el granizo. Los siervos de Faraón le dicen que Egipto está perdido.", god: "las cosechas, bajo la protección de Osiris, según algunos." },
  { n: 9, e: "🌑", name: "Las tinieblas", ref: "Éxodo 10:21-29", text: "Tres días de oscuridad tan densa que casi se podía palpar. Los israelitas, en cambio, tenían luz en sus moradas.", god: "Ra, dios del sol." },
  { n: 10, e: "🕯️", name: "La muerte de los primogénitos", ref: "Éxodo 11:1 – 12:36", text: "Dios hiere a todo primogénito de Egipto en una sola noche. Las casas de Israel, marcadas con la sangre del cordero, quedan protegidas: es la Pascua.", god: "el mismo Faraón, que era tenido por divino." },
];

export function Plagues() {
  const [sel, setSel] = useState(0);
  const p = PLAGUES[sel];
  return (
    <Shell title="Las diez plagas de Egipto" hint="Toca cada plaga para ver qué pasó y en qué pasaje la encuentras. Las verás desde este capítulo hasta el 12.">
      <div className="grid grid-cols-5 gap-2">
        {PLAGUES.map((x, k) => (
          <button
            key={x.n}
            onClick={() => setSel(k)}
            className="flex aspect-square flex-col items-center justify-center rounded-xl border text-2xl transition active:scale-95"
            style={k === sel ? { borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 16%, transparent)" } : { borderColor: "var(--line)" }}
            aria-label={`Plaga ${x.n}: ${x.name}`}
          >
            <span style={{ animation: `sc-pop .5s ease ${k * 0.05}s both` }}>{x.e}</span>
            <span className="text-[10px] text-muted">{x.n}</span>
          </button>
        ))}
      </div>
      <div key={sel} className="mt-4" style={{ animation: "sc-in .4s ease both" }}>
        <div className="flex items-center gap-3">
          <span className="text-5xl" style={{ animation: "sc-pop .5s ease both" }}>{p.e}</span>
          <div>
            <p className="eyebrow">Plaga {p.n} de 10 · {p.ref}</p>
            <h3 className="heading text-xl font-semibold">{p.name}</h3>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
        <p className="mt-2 text-xs text-muted"><span className="font-semibold text-accent">Posible símbolo desafiado:</span> {p.god}</p>
      </div>
      <p className="mt-4 rounded-xl border border-line p-3 text-xs leading-relaxed text-muted">
        La relación con dioses egipcios la sugieren muchos comentaristas. El texto, en Éxodo 12:12, solo dice que Dios ejecutó juicios contra todos los dioses de Egipto.
      </p>
    </Shell>
  );
}

/* ---------------- Tabernáculo ---------------- */

const TAB = [
  { id: "altar", name: "Altar del holocausto", ref: "Éxodo 27:1-8", fill: "#b87333", shape: "rect", x: 90, y: 128, w: 46, h: 46, text: "Es lo primero que se encuentra al entrar al atrio. Aquí se quemaban los sacrificios: antes de acercarse a Dios había que pasar por el sacrificio." },
  { id: "fuente", name: "Fuente de bronce", ref: "Éxodo 30:17-21", fill: "#c98a4b", shape: "circle", cx: 215, cy: 151, r: 20, text: "Los sacerdotes se lavaban aquí las manos y los pies antes de entrar a la tienda o de servir en el altar." },
  { id: "mesa", name: "Mesa del pan de la proposición", ref: "Éxodo 25:23-30", fill: "#e0b44c", shape: "rect", x: 338, y: 108, w: 52, h: 26, text: "Sobre ella se colocaban doce panes, uno por tribu, siempre delante de Dios. Estaba al lado norte del Lugar Santo." },
  { id: "candelero", name: "El candelero de oro", ref: "Éxodo 25:31-40", fill: "#f2c94c", shape: "rect", x: 338, y: 168, w: 52, h: 26, text: "Una lámpara de siete brazos, de oro puro, que iluminaba el Lugar Santo. Estaba frente a la mesa, al lado sur." },
  { id: "incienso", name: "Altar del incienso", ref: "Éxodo 30:1-10", fill: "#e0b44c", shape: "rect", x: 432, y: 139, w: 30, h: 30, text: "Estaba justo antes del velo. El incienso que se quemaba cada mañana y cada tarde sube como imagen de las oraciones del pueblo." },
  { id: "velo", name: "El velo", ref: "Éxodo 26:31-33", fill: "#7c3aed", shape: "line", x1: 492, y1: 100, x2: 492, y2: 200, text: "Una cortina gruesa y bordada que separaba el Lugar Santo del Lugar Santísimo. Detrás de ella solo entraba el sumo sacerdote, una vez al año." },
  { id: "arca", name: "El arca del pacto", ref: "Éxodo 25:10-22", fill: "#e0b44c", shape: "rect", x: 515, y: 136, w: 50, h: 30, text: "El cofre que guardaba las tablas de la ley. Su tapa, el propiciatorio, era el lugar donde Dios se encontraba con Moisés." },
];

export function Tabernacle() {
  const s = useSteps(TAB.length, 4500);
  const it = TAB[s.i];
  const badge = (t) => (t.shape === "rect" ? [t.x, t.y] : t.shape === "circle" ? [t.cx - t.r, t.cy - t.r] : [t.x1, t.y1]);
  return (
    <Shell title="El tabernáculo visto desde arriba" hint="La entrada está a la izquierda. Toca los números o dale a reproducir para recorrerlo como lo haría un sacerdote.">
      <svg viewBox="0 0 640 300" className="w-full rounded-2xl border border-line" style={{ background: "var(--surface)" }} role="img" aria-label="Plano del tabernáculo">
        <rect x="20" y="40" width="600" height="220" rx="6" fill="color-mix(in srgb, var(--line) 35%, transparent)" stroke="var(--muted)" strokeWidth="2" strokeDasharray="6 5" />
        <rect x="14" y="128" width="14" height="44" rx="3" fill="var(--brand)" />
        <rect x="300" y="100" width="193" height="100" fill="color-mix(in srgb, var(--accent) 14%, transparent)" stroke="var(--muted)" strokeWidth="2" />
        <rect x="493" y="100" width="97" height="100" fill="color-mix(in srgb, var(--accent) 28%, transparent)" stroke="var(--muted)" strokeWidth="2" />
        {TAB.map((t, k) => {
          const on = k === s.i;
          const common = { fill: t.fill, stroke: on ? "var(--accent)" : "var(--muted)", strokeWidth: on ? 4 : 1.5, style: on ? { animation: "sc-pulse 1.4s ease-in-out infinite" } : undefined };
          const [bx, by] = badge(t);
          return (
            <g key={t.id} onClick={() => s.go(k)} style={{ cursor: "pointer" }}>
              {t.shape === "rect" && <rect x={t.x} y={t.y} width={t.w} height={t.h} rx="4" {...common} />}
              {t.shape === "circle" && <circle cx={t.cx} cy={t.cy} r={t.r} {...common} />}
              {t.shape === "line" && <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={on ? "var(--accent)" : t.fill} strokeWidth={on ? 8 : 6} style={common.style} />}
              <circle cx={bx} cy={by} r="11" fill={on ? "var(--accent)" : "var(--brand)"} />
              <text x={bx} y={by + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--bg)">{k + 1}</text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        <span>Atrio (patio abierto)</span>
        <span>Lugar Santo · Lugar Santísimo</span>
      </div>
      <Controls n={TAB.length} s={s} />
      <Info k={s.i} eyebrow={`${s.i + 1} de ${TAB.length} · ${it.ref}`} title={it.name} text={it.text} />
    </Shell>
  );
}

/* ---------------- Campamento de Israel ---------------- */

const TRIBES = {
  juda: { n: "Judá", who: "Hijo de Jacob y Lea", c: 74600 },
  isacar: { n: "Isacar", who: "Hijo de Jacob y Lea", c: 54400 },
  zabulon: { n: "Zabulón", who: "Hijo de Jacob y Lea", c: 57400 },
  ruben: { n: "Rubén", who: "Hijo de Jacob y Lea", c: 46500 },
  simeon: { n: "Simeón", who: "Hijo de Jacob y Lea", c: 59300 },
  gad: { n: "Gad", who: "Hijo de Jacob y Zilpa", c: 45650 },
  efrain: { n: "Efraín", who: "Hijo de José, nieto de Jacob", c: 40500 },
  manases: { n: "Manasés", who: "Hijo de José, nieto de Jacob", c: 32200 },
  benjamin: { n: "Benjamín", who: "Hijo de Jacob y Raquel", c: 35400 },
  dan: { n: "Dan", who: "Hijo de Jacob y Bilha", c: 62700 },
  aser: { n: "Aser", who: "Hijo de Jacob y Zilpa", c: 41500 },
  neftali: { n: "Neftalí", who: "Hijo de Jacob y Bilha", c: 53400 },
};
const SIDES = {
  N: { name: "norte", camp: "campamento de Dan", total: 157600, color: "#a855f7", tribes: ["dan", "aser", "neftali"] },
  E: { name: "este", camp: "campamento de Judá", total: 186400, color: "#e0a21b", tribes: ["juda", "isacar", "zabulon"] },
  S: { name: "sur", camp: "campamento de Rubén", total: 151450, color: "#3b82f6", tribes: ["ruben", "simeon", "gad"] },
  W: { name: "oeste", camp: "campamento de Efraín", total: 108100, color: "#10b981", tribes: ["efrain", "manases", "benjamin"] },
};
const fmtN = (n) => n.toLocaleString("es");

export function Camp() {
  const [sel, setSel] = useState(null);
  const sideOf = (id) => Object.keys(SIDES).find((k) => SIDES[k].tribes.includes(id));
  const Chip = ({ id, delay }) => {
    const t = TRIBES[id];
    const col = SIDES[sideOf(id)].color;
    const on = sel === id;
    return (
      <button
        onClick={() => setSel(on ? null : id)}
        className="rounded-xl border px-2 py-2 text-center text-xs font-semibold transition active:scale-95"
        style={{
          borderColor: col,
          background: on ? col : `color-mix(in srgb, ${col} 16%, transparent)`,
          color: on ? "#fff" : "var(--ink)",
          animation: `sc-pop .5s ease ${delay}s both`,
        }}
      >
        {t.n}
      </button>
    );
  };
  const Row = ({ k, base }) => (
    <div>
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-wider" style={{ color: SIDES[k].color }}>Norte/Sur · {SIDES[k].name}</p>
      <div className="grid grid-cols-3 gap-2">{SIDES[k].tribes.map((id, i) => <Chip key={id} id={id} delay={base + i * 0.08} />)}</div>
    </div>
  );
  const Col = ({ k, base }) => (
    <div className="flex flex-col justify-center gap-2">
      <p className="text-center text-[10px] font-semibold uppercase tracking-wider" style={{ color: SIDES[k].color }}>{SIDES[k].name}</p>
      {SIDES[k].tribes.map((id, i) => <Chip key={id} id={id} delay={base + i * 0.08} />)}
    </div>
  );
  const t = sel ? TRIBES[sel] : null;
  const sd = sel ? SIDES[sideOf(sel)] : null;
  return (
    <Shell title="El campamento de Israel" hint="Doce tribus alrededor del tabernáculo, tres por cada lado. Toca una tribu para conocerla.">
      <div className="space-y-2">
        <Row k="N" base={0} />
        <div className="grid grid-cols-[1fr_1.1fr_1fr] gap-2">
          <Col k="W" base={0.3} />
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-line p-2 text-center"
            style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", animation: "sc-pop .6s ease .2s both" }}
          >
            <span className="text-3xl">⛺</span>
            <span className="heading text-sm font-semibold">Tabernáculo</span>
            <span className="mt-1 text-[10px] leading-tight text-muted">Los levitas acampan alrededor, entre el pueblo y la presencia de Dios</span>
          </div>
          <Col k="E" base={0.5} />
        </div>
        <Row k="S" base={0.7} />
      </div>
      <p className="mt-1 text-center text-[11px] text-muted">Este a la derecha, oeste a la izquierda.</p>
      <div className="mt-3 min-h-[5.5rem]">
        {t ? (
          <div key={sel} style={{ animation: "sc-in .4s ease both" }}>
            <p className="eyebrow" style={{ color: sd.color }}>Lado {sd.name} · {sd.camp}</p>
            <h3 className="heading text-xl font-semibold">{t.n}</h3>
            <p className="mt-1 text-sm text-muted">{t.who}. Hombres de guerra: {fmtN(t.c)}. Su grupo de tres tribus sumaba {fmtN(sd.total)}.</p>
          </div>
        ) : (
          <p className="text-sm text-muted">En total contaron 603.550 hombres de guerra, sin los levitas (Números 2:32).</p>
        )}
      </div>
    </Shell>
  );
}