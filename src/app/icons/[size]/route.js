import { ImageResponse } from "next/og";

export async function GET(_req, { params }) {
  const size = Math.min(Math.max(parseInt(params.size, 10) || 512, 64), 1024);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2d3a6b",
          color: "#e0b44c",
          fontSize: size * 0.5,
          fontWeight: 700,
        }}
      >
        C
      </div>
    ),
    { width: size, height: size }
  );
}