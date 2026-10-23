import { ImageResponse } from "next/og";

// Silueta blanca sobre fondo transparente: Android la usa como ícono pequeño de la barra.
const BADGE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<path d="M32 3c2 10 13 16 13 31a13 13 0 0 1-26 0c0-6 3-10 5-13 1 4 3 6 5 6 0-8-2-14 3-24z" fill="#fff"/>
<path d="M10 55c8-5 15-5 22 0 7-5 14-5 22 0v5c-8-5-15-5-22 0-7-5-14-5-22 0z" fill="#fff"/>
</svg>`;

export async function GET() {
  const src = "data:image/svg+xml;base64," + Buffer.from(BADGE).toString("base64");
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <img src={src} width={96} height={96} />
      </div>
    ),
    { width: 96, height: 96 }
  );
}