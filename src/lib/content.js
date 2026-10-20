import { BOOKS } from "@/data/books";
import { CHAPTERS } from "@/data/chapters";

export const getBook = (slug) => BOOKS.find((b) => b.slug === slug);

export function getChapter(slug, n) {
  const b = getBook(slug);
  const c = CHAPTERS[slug]?.[n];
  return {
    custom: !!c,
    title: c?.title || `${b.name} ${n}`,
    intro:
      c?.intro ||
      `Abre tu Reina Valera 1960 en ${b.name} ${n} y léanlo juntos. Mientras avanzan, tengan presente el hilo del libro: ${b.theme.toLowerCase()}.`,
    verse: c?.verse || null,
    image: c?.image || null,
    terms: c?.terms || [],
  };
}