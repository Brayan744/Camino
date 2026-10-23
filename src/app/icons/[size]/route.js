import { ImageResponse } from "next/og";

const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3f4fa0"/><stop offset="1" stop-color="#171d49"/></linearGradient>
<radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd86b" stop-opacity=".55"/><stop offset="1" stop-color="#ffd86b" stop-opacity="0"/></radialGradient>
<linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#fde047"/></linearGradient>
</defs>
<rect width="512" height="512" fill="url(#bg)"/>
<g transform="translate(38.4 38.4) scale(.85)">
<g transform="translate(0 -40)">
<circle cx="256" cy="250" r="210" fill="url(#glow)"/>
<g transform="translate(134.4 139) scale(3.8)">
<path d="M32 3c2 10 13 16 13 31a13 13 0 0 1-26 0c0-6 3-10 5-13 1 4 3 6 5 6 0-8-2-14 3-24z" fill="url(#fl)"/>
<path d="M32 30c1 5 6 8 6 14a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3 0-4-1-7 0-10z" fill="#fff" opacity=".7"/>
</g>
<path d="M256 322C214 292 152 288 96 306V418C152 400 214 404 256 436Z" fill="#fff7e6"/>
<path d="M256 322C298 292 360 288 416 306V418C360 400 298 404 256 436Z" fill="#f1dfb8"/>
<path d="M256 322V436" stroke="#c9a24a" stroke-width="4"/>
</g>
</g>
</svg>`;

export async function GET(_req, { params }) {
  const size = Math.min(Math.max(parseInt(params.size, 10) || 512, 48), 1024);
  const src = "data:image/svg+xml;base64," + Buffer.from(LOGO).toString("base64");
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <img src={src} width={size} height={size} />
      </div>
    ),
    { width: size, height: size }
  );
}