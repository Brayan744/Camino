import Link from "next/link";
import { OUTLINE } from "@/data/outline";
import { BOOKS } from "@/data/books";

export const metadata = { title: "La Biblia · Camino de la Palabra" };

const FACTS = [
  ["66", "libros"],
  ["39 + 27", "Antiguo y Nuevo Testamento"],
  ["3", "idiomas originales: hebreo, arameo y griego"],
  ["~1.500", "años de composición"],
];

export default function Biblia() {
  const slugByName = Object.fromEntries(BOOKS.map((b) => [b.name, b.slug]));
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Panorama</p>
        <h1 className="heading text-3xl font-semibold">La Biblia de un vistazo</h1>
        <p className="mt-3 text-muted">
          La Biblia no es un solo libro, sino una biblioteca de 66 libros escritos por muchos autores a lo largo de siglos. Aun así tiene un hilo
          conductor: un Dios que crea, un mundo que se aparta de Él, y un plan de rescate y restauración que llega a su punto central en Jesús.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FACTS.map(([n, t]) => (
          <div key={t} className="card p-4">
            <p className="heading text-2xl font-semibold text-brand">{n}</p>
            <p className="text-xs text-muted">{t}</p>
          </div>
        ))}
      </div>

      {OUTLINE.map((t) => (
        <section key={t.testament} className="space-y-4">
          <h2 className="heading text-2xl font-semibold">{t.testament}</h2>
          {t.groups.map((g) => (
            <div key={g.name} className="card p-5">
              <h3 className="heading text-lg font-semibold">{g.name}</h3>
              <p className="mt-1 text-sm text-muted">{g.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.books.map((name) =>
                  slugByName[name] ? (
                    <Link key={name} href={`/libro/${slugByName[name]}`} className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-bg">
                      {name}
                    </Link>
                  ) : (
                    <span key={name} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{name}</span>
                  )
                )}
              </div>
            </div>
          ))}
        </section>
      ))}
      <p className="text-center text-xs text-muted">Los libros resaltados ya están disponibles. Los demás llegarán pronto.</p>
    </div>
  );
}