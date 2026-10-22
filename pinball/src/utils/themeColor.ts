// 맵이 직접 지정한 색(노랑, 민트, 파랑 등)을 핑크~보라 계열로 옮긴다.
// 이렇게 하면 어떤 맵을 골라도 장애물이 같은 톤으로 보인다.
//
// - 색상(hue)을 주로 바꾸고 밝기는 분홍 쪽으로 조금만 당긴다. 그래서 맵이 의도한 밝고 어두운 차이는 남는다.
// - 이 사이트의 맵은 모두 #rrggbb 로 색을 지정하므로 그 형식만 다룬다 (그 외는 원래 색 그대로).
// - 이미 분홍·빨강 계열(300°~360°)이거나 회색에 가까운 색은 손대지 않는다.
// - 노랑(55°)을 기준으로 멀어질수록 분홍에서 보라 쪽(295°)으로 이동한다.

const cache = new Map<string, string>();

const SATURATION_MIN = 0.08;
const KEEP_FROM_HUE = 300;
const ANCHOR_HUE = 55;
const ANCHOR_TARGET = 345;
const SPREAD = 50;
const MAX_DISTANCE = 245;
const TARGET_LIGHTNESS = 0.72;

function parseHex(color: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return null;
  let hex = m[1];
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return [h, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** 맵이 지정한 색을 핑크 톤으로 바꾼다. 색이 없거나 #rgb/#rrggbb 가 아니면 그대로 돌려준다 */
export function toPinkTone(color: string | undefined): string | undefined {
  if (!color) return color;
  const cached = cache.get(color);
  if (cached) return cached;

  const rgb = parseHex(color);
  if (!rgb) return color;

  let [h, s, l] = rgbToHsl(...rgb);
  if (s >= SATURATION_MIN && h < KEEP_FROM_HUE) {
    const distance = Math.min(Math.abs(h - ANCHOR_HUE), MAX_DISTANCE);
    h = ANCHOR_TARGET - (distance / MAX_DISTANCE) * SPREAD;
    // 순수한 노랑·초록이 빨강으로 쏠리지 않도록 밝기를 분홍 쪽(0.72)으로 조금 당긴다
    l += (TARGET_LIGHTNESS - l) * 0.45;
    s *= 0.92;
  }

  const result = hslToHex(h, s, l);
  cache.set(color, result);
  return result;
}
