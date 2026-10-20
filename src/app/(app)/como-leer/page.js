export const metadata = { title: "Cómo leerla · Camino de la Palabra" };

const STEPS = [
  ["Antes de leer", "Abran la introducción del capítulo en la app. Les da el contexto: quién habla, dónde están y qué viene pasando."],
  ["Lean juntos", "Lean en voz alta, turnándose por párrafos o por versículos. Usen su Reina Valera 1960 o la que tengan a la mano."],
  ["Observen", "Fíjense en quiénes participan, qué se repite, qué cambia y qué sorprende. Observar bien evita interpretar de más."],
  ["Entiendan el contexto", "Pregúntense qué significaba esto para los primeros lectores. Los comentarios como los de Thompson o MacArthur ayudan a profundizar."],
  ["Compartan en el chat", "Escriban lo que les llamó la atención, manden una foto de lo que subrayaron o una nota de voz. Todo queda guardado en ese capítulo."],
];

const GENRES = [
  ["Narrativa", "Cuenta una historia. Sigan la trama y los personajes antes de sacar conclusiones."],
  ["Ley", "Muestra cómo vivía Israel bajo la alianza. Pregunten qué revela del carácter de Dios."],
  ["Poesía", "Usa imágenes y emociones. No se lee literalmente, se lee sintiendo."],
  ["Profecía", "Llama a volver a Dios y anuncia lo que viene. Ubiquen el momento histórico."],
  ["Cartas", "Responden a situaciones reales. Lean la carta entera, como si la recibieran."],
];

export default function ComoLeer() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Guía</p>
        <h1 className="heading text-3xl font-semibold">Cómo leer la Biblia en pareja</h1>
        <p className="mt-3 text-muted">Un método sencillo para leer con calma, entender mejor y disfrutar el camino juntos.</p>
      </div>

      <ol className="space-y-3">
        {STEPS.map(([t, d], i) => (
          <li key={t} className="card flex gap-4 p-5">
            <span className="heading flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-bg">{i + 1}</span>
            <div>
              <h3 className="heading text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          </li>
        ))}
      </ol>

      <section>
        <h2 className="heading mb-3 text-2xl font-semibold">Según el tipo de texto</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {GENRES.map(([t, d]) => (
            <div key={t} className="card p-4">
              <h3 className="heading font-semibold text-accent">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}