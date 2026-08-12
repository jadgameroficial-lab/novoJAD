import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "JAD, engenharia digital inteligente";

export default async function OpengraphImage() {
  const wordmarkFont = await readFile(join(process.cwd(), "public/fonts/researcher.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#f5f5f5",
        }}
      >
        <div style={{ fontFamily: "JADWordmark", fontSize: 120, color: "#f5f5f5" }}>JAD</div>
        <div style={{ marginTop: 24, fontSize: 32, color: "rgba(245,245,245,0.62)" }}>
          Engenharia digital inteligente.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "JADWordmark", data: wordmarkFont, style: "normal" }],
    }
  );
}
