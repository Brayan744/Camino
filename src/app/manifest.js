export default function manifest() {
  return {
    name: "Camino de la Palabra",
    short_name: "Camino",
    description: "Estudio bíblico en pareja",
    start_url: "/inicio",
    display: "standalone",
    background_color: "#faf6ee",
    theme_color: "#2d3a6b",
    lang: "es",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}