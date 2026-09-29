import { ImageResponse } from "next/og";
import { TANKARD_PALETTE, TANKARD_ROWS } from "@/components/art";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Icône d'écran d'accueil : la chope à lunettes pixel, sur fond nuit. */
export default function AppleIcon() {
  const pixel = 9;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1d162b",
          backgroundImage: "radial-gradient(circle at 50% 0%, rgba(122,70,255,0.5), transparent 70%)",
        }}
      >
        <svg
          width={16 * pixel}
          height={16 * pixel}
          viewBox="0 0 16 16"
          shapeRendering="crispEdges"
          style={{ marginLeft: 12 }}
        >
          {TANKARD_ROWS.flatMap((row, y) =>
            row.split("").map((char, x) =>
              TANKARD_PALETTE[char] ? (
                <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={TANKARD_PALETTE[char]} />
              ) : null,
            ),
          )}
        </svg>
      </div>
    ),
    { ...size },
  );
}
