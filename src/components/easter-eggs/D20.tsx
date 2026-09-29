"use client";

/**
 * Un vrai d20 en 3D CSS : icosaèdre calculé (12 sommets, 20 faces triangulaires
 * placées en `matrix3d`), faces opposées qui totalisent 21 comme sur un vrai dé.
 * La face du résultat regarde l'écran au repos : le dé roule depuis une rotation
 * quelconque et s'arrête pile dessus.
 *
 * Tout passe par `transform` (composité par le GPU). Aucune opacité ni filtre sur
 * la chaîne `preserve-3d` (ça aplatirait le dé).
 */

import { m } from "motion/react";
import { useMemo } from "react";
import { seededRandom } from "@/lib/client/copy";

type Vec = [number, number, number];

const PHI = (1 + Math.sqrt(5)) / 2;
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const length = (a: Vec) => Math.sqrt(dot(a, a));
const unit = (a: Vec) => mul(a, 1 / length(a));

type Matrix = [Vec, Vec, Vec];
const apply = (matrix: Matrix, v: Vec): Vec => [dot(matrix[0], v), dot(matrix[1], v), dot(matrix[2], v)];

/** Rotation qui amène le vecteur unitaire `from` sur `to` (formule de Rodrigues). */
function rotationBetween(from: Vec, to: Vec): Matrix {
  const v = cross(from, to);
  const s = length(v);
  const c = dot(from, to);
  if (s < 1e-9) return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const k = (1 - c) / (s * s);
  const [x, y, z] = v;
  return [
    [1 - k * (y * y + z * z), -z + k * x * y, y + k * x * z],
    [z + k * x * y, 1 - k * (x * x + z * z), -x + k * y * z],
    [-y + k * x * z, x + k * y * z, 1 - k * (x * x + y * y)],
  ];
}

interface Face {
  /** Sommets ordonnés : A en haut, B et C en bas (repère CSS : y vers le bas, z vers l'écran). */
  a: Vec;
  b: Vec;
  c: Vec;
  normal: Vec;
  opposite: number;
}

/** Géométrie calculée une seule fois : face 0 = face avant, sommet A en haut. */
const GEOMETRY: Face[] = (() => {
  const vertices: Vec[] = [];
  for (const p of [-1, 1]) {
    for (const q of [-1, 1]) {
      vertices.push([0, p, q * PHI], [p, q * PHI, 0], [q * PHI, 0, p]);
    }
  }
  const near = (i: number, j: number) => Math.abs(length(sub(vertices[i], vertices[j])) - 2) < 1e-6;
  const triples: Array<[number, number, number]> = [];
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) for (let k = j + 1; k < 12; k++) if (near(i, j) && near(j, k) && near(i, k)) triples.push([i, j, k]);

  const centroid = (t: [number, number, number]) => unit(add(add(vertices[t[0]], vertices[t[1]]), vertices[t[2]]));
  const front = triples.reduce((best, t) => (centroid(t)[2] > centroid(best)[2] ? t : best), triples[0]);
  const align = rotationBetween(centroid(front), [0, 0, 1]);
  let rotated = vertices.map((v) => apply(align, v));
  // On tourne autour de z pour que la face avant ait un sommet pile en haut (y négatif en CSS).
  const top = front.map((i) => rotated[i]).reduce((best, v) => (v[1] < best[1] ? v : best));
  const angle = -Math.PI / 2 - Math.atan2(top[1], top[0]);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  rotated = rotated.map(([x, y, z]) => [x * cos - y * sin, x * sin + y * cos, z]);

  const ordered = [front, ...triples.filter((t) => t !== front)];
  const faces: Face[] = ordered.map((t) => {
    const points = t.map((i) => rotated[i]);
    const normal = unit(add(add(points[0], points[1]), points[2]));
    // A : le sommet le plus « haut » dans le plan de la face (pour la face avant : en haut de l'écran).
    const sorted = [...points].sort((p, q) => p[1] - q[1]);
    const a = sorted[0];
    let [b, c] = [sorted[1], sorted[2]];
    const ex = sub(b, c);
    const ey = sub(mul(add(b, c), 0.5), a);
    if (dot(cross(ex, ey), normal) < 0) [b, c] = [c, b];
    return { a, b, c, normal, opposite: -1 };
  });
  faces.forEach((face, index) => {
    face.opposite = faces.findIndex((other, j) => j !== index && dot(other.normal, face.normal) < -0.999);
  });
  return faces;
})();

/** Numérotation : la face avant porte le résultat, chaque paire opposée totalise 21. */
function numbering(value: number, seed: number): number[] {
  const random = seededRandom(seed);
  const numbers = new Array<number>(20).fill(0);
  numbers[0] = value;
  numbers[GEOMETRY[0].opposite] = 21 - value;
  const pool: number[] = [];
  for (let n = 1; n <= 10; n++) if (n !== value && n !== 21 - value) pool.push(n);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  let cursor = 0;
  GEOMETRY.forEach((face, index) => {
    if (numbers[index] !== 0) return;
    const n = pool[cursor++];
    const flip = random() < 0.5;
    numbers[index] = flip ? 21 - n : n;
    numbers[face.opposite] = flip ? n : 21 - n;
  });
  return numbers;
}

function shade(hex: string, factor: number): string {
  const value = Number.parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.min(255, Math.round(((value >> shift) & 255) * factor));
  return `rgb(${channel(16)} ${channel(8)} ${channel(0)})`;
}

const LIGHT = unit([-0.45, -0.7, 0.8]);

export interface D20Props {
  value: number;
  seed: number;
  /** Diamètre approximatif du dé, en px. */
  size: number;
  color?: string;
  inkColor?: string;
  /** Couleur du chiffre du résultat (face avant), plus gros que les autres. */
  resultInk?: string;
  delay?: number;
  duration?: number;
  className?: string;
}

/** Le dé qui roule, tombe, rebondit et s'arrête sur `value`. */
export function D20({ value, seed, size, color = "#c62a3a", inkColor = "#fff6dc", resultInk, delay = 0, duration = 1.5, className }: D20Props) {
  const edge = size / 1.902;
  const height = (edge * Math.sqrt(3)) / 2;
  const scale = edge / 2;
  const numbers = useMemo(() => numbering(value, seed), [value, seed]);
  const spin = useMemo(() => {
    const random = seededRandom(seed + 7);
    const turns = (min: number) => (min + Math.floor(random() * 2)) * 360 * (random() < 0.5 ? -1 : 1);
    return { x: turns(2), y: turns(2), z: turns(1) };
  }, [seed]);

  const faces = useMemo(
    () =>
      GEOMETRY.map((face, index) => {
        const a = mul(face.a, scale);
        const b = mul(face.b, scale);
        const c = mul(face.c, scale);
        const ex = mul(sub(b, c), 1 / edge);
        const ey = mul(sub(mul(add(b, c), 0.5), a), 1 / height);
        const origin = sub(c, mul(ey, height));
        const n = face.normal;
        const matrix = [ex[0], ex[1], ex[2], 0, ey[0], ey[1], ey[2], 0, n[0], n[1], n[2], 0, origin[0], origin[1], origin[2], 1]
          .map((v) => (Math.abs(v) < 1e-9 ? 0 : Number(v.toFixed(5))))
          .join(",");
        const light = 0.62 + 0.5 * Math.max(0, dot(n, LIGHT));
        return { index, matrix, fill: shade(color, light), edge: shade(color, 0.45), number: numbers[index] };
      }),
    [color, edge, height, numbers, scale],
  );

  return (
    <div className={className} style={{ width: size, height: size, perspective: size * 4 }}>
      <m.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateX: spin.x + 37, rotateY: spin.y - 23, rotateZ: spin.z + 51 }}
        animate={{ rotateX: 0, rotateY: 0, rotateZ: 0 }}
        transition={{ delay, duration, ease: [0.15, 0.7, 0.25, 1] }}
      >
        <div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
          {faces.map((face) => (
            <div
              key={face.index}
              className="absolute left-0 top-0"
              style={{ width: edge, height, transformOrigin: "0 0", transform: `matrix3d(${face.matrix})`, backfaceVisibility: "hidden" }}
            >
              <svg viewBox={`0 0 ${edge} ${height}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                <polygon points={`${edge / 2},0.6 ${edge - 0.6},${height - 0.4} 0.6,${height - 0.4}`} fill={face.fill} stroke={face.edge} strokeWidth={Math.max(1.5, edge * 0.025)} strokeLinejoin="round" />
              </svg>
              <span
                className="absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2 font-display leading-none"
                style={{
                  fontSize: edge * (face.index === 0 ? (face.number >= 10 ? 0.4 : 0.46) : face.number >= 10 ? 0.3 : 0.36),
                  color: face.index === 0 && resultInk ? resultInk : inkColor,
                  WebkitTextStroke: `${Math.max(1, edge * 0.018)}px rgb(0 0 0 / 0.55)`,
                  paintOrder: "stroke fill",
                  textDecoration: face.number === 6 || face.number === 9 ? "underline" : undefined,
                }}
              >
                {face.number}
              </span>
            </div>
          ))}
        </div>
      </m.div>
    </div>
  );
}
