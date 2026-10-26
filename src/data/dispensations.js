// Las siete dispensaciones según la tradición dispensacionalista (Scofield, Chafer, MacArthur).
// Solo se citan referencias, nunca texto bíblico, para evitar citas inexactas.

export const DISPENSATIONS = [
  {
    id: "inocencia", n: 1, name: "Inocencia", emoji: "🌳",
    period: "Desde la creación hasta la caída", passage: "Gn 1:28 – 3:6",
    idea: "Dios y el ser humano conviven sin pecado en el jardín; solo hay una condición: confiar en su palabra.",
    story: "Adán y Eva viven en el Edén en comunión directa con Dios. Todo es «bueno», no hay vergüenza, ni muerte, ni enfermedad. Su vida es sencilla: cuidar el jardín, llenar la tierra y obedecer una única restricción.",
    duty: "Cuidar el jardín, ser fructíferos y no comer del árbol del conocimiento del bien y del mal (Gn 2:16-17).",
    fail: "Desconfiaron de lo que Dios había dicho y comieron del fruto (Gn 3:1-6).",
    judgment: "Entra la muerte al mundo y son expulsados del Edén (Gn 3:16-24).",
    grace: "Dios los busca, los cubre con túnicas de piel y anuncia a un descendiente que vencerá a la serpiente (Gn 3:15, 21).",
    tip: "Fíjense cómo es el mundo «antes de que algo se rompa». Es el punto de referencia para entender todo lo que Cristo restaura al final.",
  },
  {
    id: "conciencia", n: 2, name: "Conciencia", emoji: "🕯️",
    period: "De la caída al diluvio", passage: "Gn 3:7 – 8:14",
    idea: "Sin ley escrita, la humanidad vive guiada por la conciencia y por lo que sabe de Dios.",
    story: "Fuera del Edén, la humanidad conoce el bien y el mal. Aparecen Caín y Abel, la línea de Set, Enoc que camina con Dios, y Noé. Dios aún no ha dado una ley escrita: cada quien responde a lo que su conciencia y la revelación de Dios le muestran.",
    duty: "Hacer el bien y acercarse a Dios con el sacrificio que Él aceptaba (Gn 4:3-7).",
    fail: "Caín mata a Abel y la violencia y la maldad llenan la tierra (Gn 4:8; 6:5, 11-12).",
    judgment: "El diluvio (Gn 7–8).",
    grace: "Dios salva a Noé y a su familia en el arca (Gn 6:8, 18).",
    tip: "Observen que, aun sin ley escrita, Dios sigue hablando y la gente sigue siendo responsable. Noten también a los pocos que «caminan con Dios».",
  },
  {
    id: "gobierno", n: 3, name: "Gobierno humano", emoji: "🏛️",
    period: "Del diluvio a Babel", passage: "Gn 8:15 – 11:9",
    idea: "Dios entrega a los seres humanos la responsabilidad de gobernar y proteger la vida.",
    story: "Noé sale del arca y Dios hace un pacto con él: promete no volver a destruir la tierra con un diluvio y establece la justicia humana como forma de proteger la vida. La humanidad se multiplica otra vez, pero en lugar de dispersarse por la tierra, se reúne en Babel.",
    duty: "Llenar la tierra y gobernar con justicia, respetando la vida (Gn 9:1, 6).",
    fail: "En Babel se reúnen para hacerse un nombre y no dispersarse como Dios había mandado (Gn 11:1-4).",
    judgment: "Dios confunde las lenguas y los dispersa por la tierra (Gn 11:7-9).",
    grace: "El arco iris como señal de que Dios no volverá a inundar la tierra (Gn 9:11-17).",
    tip: "Piensen en qué pasa cuando el poder humano se separa de Dios. El mismo tema reaparecerá en Egipto, en Babilonia y en Apocalipsis.",
  },
  {
    id: "promesa", n: 4, name: "Promesa", emoji: "⭐",
    period: "De Abraham al Sinaí", passage: "Gn 11:10 – Éx 18",
    idea: "Dios llama a una familia y le promete tierra, descendencia y bendición para todas las naciones.",
    story: "Dios llama a Abraham y le promete una tierra, una descendencia numerosa y que por él serían bendecidas todas las familias de la tierra. Esa promesa pasa a Isaac, a Jacob y a José. La familia termina en Egipto y con el tiempo pasa de huéspedes a esclavos, hasta que Dios envía a Moisés.",
    duty: "Confiar en lo que Dios prometió y vivir como peregrinos, por fe (Gn 12:1-4; 15:6).",
    fail: "Con el tiempo la familia se asienta en Egipto y termina esclavizada; la promesa parece muy lejana (Éx 1).",
    judgment: "La esclavitud en Egipto.",
    grace: "Dios oye el clamor del pueblo, se acuerda de su pacto y envía a Moisés a rescatarlos (Éx 2:23-25; 3).",
    tip: "Busquen cuántas veces Dios repite la promesa y cuántas veces los patriarcas intentan «ayudar» a Dios por su cuenta. La promesa depende de Dios, no de ellos.",
  },
  {
    id: "ley", n: 5, name: "Ley", emoji: "📜",
    period: "Del Sinaí a la cruz", passage: "Éx 19 – Hch 1",
    idea: "Dios hace alianza con Israel como nación y le da su ley, su sacerdocio y su tabernáculo.",
    story: "En el Sinaí, Dios entrega la ley y hace alianza con Israel: los mandamientos, los sacrificios, el sacerdocio, las fiestas y el tabernáculo. Esta etapa abarca la entrada a la tierra, los jueces, los reyes, los profetas, el exilio y el regreso, y llega hasta la venida de Cristo.",
    duty: "Obedecer la ley de Moisés y, cuando fallaban, acudir al sacrificio y al arrepentimiento (Éx 19:5-8).",
    fail: "Israel cae una y otra vez en idolatría y desobediencia: el becerro de oro (Éx 32), la rebelión en el desierto, los reyes infieles.",
    judgment: "Los exilios en Asiria y Babilonia (2 R 17; 25) y, al final de la etapa, la destrucción de Jerusalén.",
    grace: "Los sacrificios, el sacerdocio y el tabernáculo mostraban cómo un pecador se acerca a un Dios santo, y apuntaban a Cristo (He 10:1). La ley nunca fue un camino para ganar la salvación (Gá 3:11).",
    tip: "Cuando lean Levítico, Números y Deuteronomio, recuerden que son el «manual de la alianza». Pregúntense qué revela cada ley sobre cómo es Dios.",
  },
  {
    id: "gracia", n: 6, name: "Gracia (la iglesia)", emoji: "🕊️",
    period: "De Pentecostés al regreso de Cristo", passage: "Hch 2 – Ap 19",
    idea: "Salvación ofrecida a judíos y gentiles por gracia, mediante la fe en Cristo, con el Espíritu Santo habitando en los creyentes.",
    story: "Con la muerte y resurrección de Jesús y la venida del Espíritu en Pentecostés nace la iglesia, formada por judíos y gentiles en un solo cuerpo (Ef 2:11-22). Es la etapa en la que vivimos: se anuncia el evangelio a todas las naciones mientras se espera el regreso del Señor.",
    duty: "Creer en Cristo, vivir en el Espíritu y anunciar el evangelio (Jn 3:16; Ef 2:8-9).",
    fail: "Apostasía: muchos se apartan de la sana doctrina (2 Ts 2:3; 2 Ti 4:3-4).",
    judgment: "La tribulación y el juicio sobre un mundo que rechaza a Cristo (Ap 6–19).",
    grace: "El don mismo de Cristo, que murió y resucitó, y el Espíritu Santo que sella y capacita al creyente.",
    tip: "Al llegar a los Evangelios, noten que Jesús vive todavía bajo la ley y la prepara para su cumplimiento. El cambio grande se ve en Hechos y en las cartas.",
  },
  {
    id: "reino", n: 7, name: "Reino (el milenio)", emoji: "👑",
    period: "El reinado de Cristo en la tierra", passage: "Ap 20:1-6",
    idea: "Cristo reina en persona con justicia y paz, y se cumplen las promesas hechas a Israel.",
    story: "Cristo vuelve y gobierna mil años sobre la tierra. Satanás está atado, hay paz y justicia, y se cumplen las promesas del reino hechas a Israel y a David (Is 11; Ap 20:1-6). Después de esta etapa viene el estado eterno.",
    duty: "Obedecer al Rey que gobierna en persona.",
    fail: "Al terminar los mil años, Satanás es soltado y muchos se rebelan (Ap 20:7-9).",
    judgment: "Fuego del cielo y el juicio final ante el gran trono blanco (Ap 20:9-15).",
    grace: "Después viene el cielo nuevo y la tierra nueva, donde Dios habita con su pueblo para siempre (Ap 21–22).",
    tip: "Es la dispensación que más se discute entre tradiciones. Lean Apocalipsis 20 con calma y comparen lo que dice el texto con lo que dicen las distintas posturas.",
  },
];

// En qué dispensación cae cada capítulo de los libros ya escritos: [desde, hasta, id].
const RANGES = {
  genesis: [[1, 2, "inocencia"], [3, 8, "conciencia"], [9, 11, "gobierno"], [12, 50, "promesa"]],
  exodo: [[1, 18, "promesa"], [19, 40, "ley"]],
  levitico: [[1, 27, "ley"]],
  numeros: [[1, 36, "ley"]],
  deuteronomio: [[1, 34, "ley"]],
};

// Momentos de cambio que se muestran en medio de la lectura.
const MARKERS = {
  "genesis:1": { id: "inocencia", note: "Aquí empieza todo: la creación y la vida en el Edén." },
  "genesis:3": { id: "conciencia", note: "Esta etapa comienza justo después de la caída (Gn 3:7), en este mismo capítulo." },
  "genesis:9": { id: "gobierno", note: "En realidad empezó cuando Noé salió del arca (Gn 8:15); aquí se establece el pacto que la define." },
  "genesis:12": { id: "promesa", note: "Dios llama a Abraham y empieza la historia de la promesa." },
  "exodo:19": { id: "ley", note: "En el Sinaí, Dios entrega la ley y hace alianza con Israel." },
};

export function getDisp(id) {
  return DISPENSATIONS.find((d) => d.id === id) || DISPENSATIONS[0];
}

export function dispIndex(id) {
  const i = DISPENSATIONS.findIndex((d) => d.id === id);
  return i < 0 ? 0 : i;
}

export function dispensationAt(slug, chapter) {
  const r = RANGES[slug];
  if (!r) return "ley";
  const hit = r.find(([a, b]) => chapter >= a && chapter <= b);
  return hit ? hit[2] : r[r.length - 1][2];
}

export function bookRanges(slug) {
  return (RANGES[slug] || []).map(([from, to, id]) => ({ from, to, id }));
}

export function allRanges() {
  const out = [];
  for (const slug of Object.keys(RANGES)) for (const r of bookRanges(slug)) out.push({ slug, ...r });
  return out;
}

export function markerAt(slug, chapter) {
  const m = MARKERS[`${slug}:${chapter}`];
  return m ? { ...m, d: getDisp(m.id) } : null;
}
