import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

const FEATURES = [
  ["📖", "Un libro a la vez", "Marquen cada capítulo leído y desbloqueen el siguiente libro."],
  ["💬", "Un chat por capítulo", "Escriban, compartan fotos y notas de voz mientras leen."],
  ["🔥", "Rachas", "Mantengan el hábito de leer juntos día tras día."],
  ["🗺️", "Mapas y líneas de tiempo", "Ubiquen cada historia en su lugar y en su momento."],
];

export default async function Home() {
  const user = await getUser();
  if (user) redirect("/inicio");
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <p className="eyebrow mb-3">Estudio bíblico en pareja</p>
      <h1 className="heading text-5xl font-semibold leading-tight sm:text-6xl">Camino de la Palabra</h1>
      <p className="mt-5 text-lg text-muted">
        Recorran la Biblia juntos, capítulo a capítulo. Empezamos por el Pentateuco: Génesis, Éxodo, Levítico,
        Números y Deuteronomio.
      </p>
      <div className="mt-8">
        <Link href="/entrar" className="btn-primary">Empezar</Link>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {FEATURES.map(([e, t, d]) => (
          <div key={t} className="card p-5">
            <div className="text-2xl">{e}</div>
            <h3 className="heading mt-2 text-lg font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </div>
        ))}
      </div>
    </main>
  );
}