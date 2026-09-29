import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { GLASSES_ROWS, TANKARD_PALETTE, TANKARD_ROWS } from "@/components/art";

export const alt = "Chouffinder : tape un mot, on te dit si c'est chouffin ou pas.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Polices libres (OFL), livrées dans public/og avec leur licence.
const anton = await readFile(join(process.cwd(), "public/og/Anton-Regular.ttf"));
const comic = await readFile(join(process.cwd(), "public/og/ComicNeue-Bold.ttf"));

/** Grille de pixels en SVG (Satori sait rendre le SVG inline). */
function pixels(rows: readonly string[], palette: Record<string, string>, pixelSize: number) {
  const width = rows[0].length;
  return (
    <svg
      width={width * pixelSize}
      height={rows.length * pixelSize}
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
    >
      {rows.flatMap((row, y) =>
        row.split("").map((char, x) =>
          palette[char] ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={palette[char]} /> : null,
        ),
      )}
    </svg>
  );
}

const outline = "-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 5px 0 #000, 0 -5px 0 #000, 5px 0 0 #000, -5px 0 0 #000";

export default async function OpengraphImage() {
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
          position: "relative",
          backgroundColor: "#0e0a16",
          backgroundImage:
            "radial-gradient(circle at 50% -10%, rgba(122,70,255,0.55), transparent 60%), radial-gradient(circle at 0% 100%, rgba(182,255,46,0.18), transparent 45%), radial-gradient(circle at 100% 100%, rgba(255,62,165,0.18), transparent 45%)",
          fontFamily: "Anton",
          color: "#fff",
        }}
      >
        <div style={{ position: "absolute", top: 36, left: 44, display: "flex", alignItems: "center", gap: 16 }}>
          {pixels(TANKARD_ROWS, TANKARD_PALETTE, 4)}
          <div style={{ fontSize: 40, letterSpacing: 1 }}>CHOUFFINDER</div>
        </div>

        <div style={{ position: "absolute", top: 70, right: 70, fontFamily: "Comic Neue", fontSize: 44, color: "#ff3ea5", transform: "rotate(10deg)" }}>
          such chouffin
        </div>
        <div style={{ position: "absolute", bottom: 64, left: 70, fontFamily: "Comic Neue", fontSize: 40, color: "#3ef0ff", transform: "rotate(-8deg)" }}>
          very Kaamelott
        </div>
        <div style={{ position: "absolute", bottom: 150, right: 90, fontFamily: "Comic Neue", fontSize: 48, color: "#fff23e", transform: "rotate(6deg)" }}>
          wow
        </div>

        <div style={{ fontSize: 118, lineHeight: 1, textShadow: outline, marginTop: 40 }}>C&apos;EST CHOUFFIN</div>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            padding: 6,
            borderRadius: 30,
            backgroundImage: "linear-gradient(90deg, #ff3ea5, #ff8a1a, #fff23e, #b6ff2e, #3ef0ff, #9b7bff)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              width: 760,
              padding: "14px 14px 14px 34px",
              borderRadius: 24,
              backgroundColor: "#1a1328",
            }}
          >
            <div style={{ flex: 1, fontFamily: "Comic Neue", fontSize: 46, color: "#f7f1e5" }}>Kaamelott</div>
            <div
              style={{
                display: "flex",
                padding: "14px 28px",
                borderRadius: 16,
                backgroundImage: "linear-gradient(180deg, #e2ff9a 0%, #b6ff2e 46%, #93e600 54%, #a8f51e 100%)",
                color: "#11210a",
                fontSize: 34,
                boxShadow: "0 6px 0 #4f8a00",
              }}
            >
              CHOUFFIN ?
            </div>
          </div>
        </div>

        <div style={{ fontSize: 118, lineHeight: 1, textShadow: outline, marginTop: 30 }}>OU PAS ?</div>

        <div
          style={{
            position: "absolute",
            right: 70,
            top: 250,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "rotate(-8deg)",
          }}
        >
          {pixels(GLASSES_ROWS, { K: "#050505", W: "#ffffff" }, 7)}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, weight: 400, style: "normal" },
        { name: "Comic Neue", data: comic, weight: 700, style: "normal" },
      ],
    },
  );
}
