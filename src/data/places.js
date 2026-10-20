// Mapa esquemático (no a escala). Coordenadas dentro de un lienzo de 900 x 500.
export const PLACES = [
  { id: "eden", name: "Edén", x: 740, y: 190, note: "Ubicación incierta; el relato lo sitúa hacia el oriente.", refs: "Génesis 2–3" },
  { id: "ararat", name: "Ararat", x: 610, y: 70, note: "Región donde reposó el arca.", refs: "Génesis 8" },
  { id: "babel", name: "Babel", x: 740, y: 290, note: "La llanura de Sinar y la torre.", refs: "Génesis 11" },
  { id: "ur", name: "Ur", x: 810, y: 355, note: "Ciudad de origen de Abram.", refs: "Génesis 11–12" },
  { id: "haran", name: "Harán", x: 530, y: 120, note: "Escala del viaje de Abram; allí vivió Jacob con Labán.", refs: "Génesis 11–12; 28–31" },
  { id: "canaan", name: "Canaán", x: 330, y: 250, note: "La tierra prometida a Abraham.", refs: "Génesis 12–50" },
  { id: "egipto", name: "Egipto", x: 140, y: 345, note: "Donde José gobernó y donde Israel fue esclavo.", refs: "Génesis 37–50; Éxodo 1–15" },
  { id: "sinai", name: "Sinaí", x: 235, y: 430, note: "El monte de la alianza y la ley.", refs: "Éxodo 19 – Números 10" },
  { id: "moab", name: "Moab", x: 455, y: 320, note: "Las llanuras desde donde Moisés vio la tierra.", refs: "Números 22 – Deuteronomio 34" },
];

export const ROUTE = ["ur", "haran", "canaan", "egipto", "sinai", "moab"];