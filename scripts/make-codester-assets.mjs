/**
 * Creates Codester preview (800x400) and icon (200x200) PNGs without deps.
 * Solid brand gradient + product title (simple uncompressed RGBA PNG).
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "codester");
mkdirSync(outDir, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function writePng(file, width, height, paint) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a = 255] = paint(x, y, width, height);
      const i = row + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(file, png);
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function previewPaint(x, y, w, h) {
  const t = x / w;
  const r = lerp(20, 88, t);
  const g = lerp(16, 80, t * 0.6);
  const b = lerp(40, 220, t);
  // soft vignette
  const cx = x / w - 0.5;
  const cy = y / h - 0.5;
  const v = Math.min(1, Math.sqrt(cx * cx + cy * cy) * 1.2);
  return [lerp(r, 8, v), lerp(g, 8, v), lerp(b, 16, v), 255];
}

function iconPaint(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy) / (w * 0.48);
  if (dist > 1) return [9, 11, 18, 255];
  const t = (x + y) / (w + h);
  return [lerp(139, 60, t), lerp(112, 140, t), lerp(255, 255, t), 255];
}

// Draw a simple 5-point star into preview/icon by brightening pixels
function withStar(paint, size) {
  return (x, y, w, h) => {
    const base = paint(x, y, w, h);
    const cx = w / 2;
    const cy = h / 2 - size * 0.02;
    const dx = x - cx;
    const dy = y - cy;
    const ang = Math.atan2(dy, dx);
    const r = Math.sqrt(dx * dx + dy * dy);
    const spike = Math.cos(ang * 5) * 0.35 + 0.65;
    const maxR = size * 0.12 * spike;
    if (r < maxR) return [255, 255, 255, 255];
    return base;
  };
}

writePng(path.join(outDir, "preview-800x400.png"), 800, 400, withStar(previewPaint, 400));
writePng(path.join(outDir, "icon-200x200.png"), 200, 200, withStar(iconPaint, 200));
// Also produce 1600x800 variant reviewers sometimes request
writePng(path.join(outDir, "preview-1600x800.png"), 1600, 800, withStar(previewPaint, 800));

console.log(`Wrote Codester assets to ${outDir}`);
