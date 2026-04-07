// Color conversion utilities

export interface ColorFormats {
  hex: string;
  rgb: { r: number; g: number; b: number };
  rgba: { r: number; g: number; b: number; a: number };
  hsl: { h: number; s: number; l: number };
  hsla: { h: number; s: number; l: number; a: number };
  hwb: { h: number; w: number; b: number };
  oklch: { l: number; c: number; h: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function round(v: number, d = 2) {
  return Math.round(v * 10 ** d) / 10 ** d;
}

// HEX → RGB
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const m = hex
    .replace("#", "")
    .match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

// RGB → HEX
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

// RGB → HSL
export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: round(h * 360, 1), s: round(s * 100, 1), l: round(l * 100, 1) };
}

// HSL → RGB
export function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// RGB → HWB
export function rgbToHwb(r: number, g: number, b: number) {
  const { h } = rgbToHsl(r, g, b);
  const w = (Math.min(r, g, b) / 255) * 100;
  const bl = (1 - Math.max(r, g, b) / 255) * 100;
  return { h: round(h, 1), w: round(w, 1), b: round(bl, 1) };
}

// RGB → CMYK
export function rgbToCmyk(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: round(((1 - r - k) / (1 - k)) * 100, 1),
    m: round(((1 - g - k) / (1 - k)) * 100, 1),
    y: round(((1 - b - k) / (1 - k)) * 100, 1),
    k: round(k * 100, 1),
  };
}

// RGB → OKLCh (approximate)
export function rgbToOklch(r: number, g: number, b: number) {
  // linearize sRGB
  const lin = (v: number) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const lr = lin(r),
    lg = lin(g),
    lb = lin(b);

  // to OKLab via LMS
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l1 = Math.cbrt(l_),
    m1 = Math.cbrt(m_),
    s1 = Math.cbrt(s_);

  const L = 0.2104542553 * l1 + 0.793617785 * m1 - 0.0040720468 * s1;
  const a = 1.9779984951 * l1 - 2.428592205 * m1 + 0.4505937099 * s1;
  const bOk = 0.0259040371 * l1 + 0.7827717662 * m1 - 0.808675766 * s1;

  const C = Math.sqrt(a * a + bOk * bOk);
  let H = (Math.atan2(bOk, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return { l: round(L, 4), c: round(C, 4), h: round(H, 1) };
}

// OKLCh → RGB (inverse)
export function oklchToRgb(L: number, C: number, H: number) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l1 = L + 0.3963377774 * a + 0.2158037573 * b;
  const m1 = L - 0.1055613458 * a - 0.0638541728 * b;
  const s1 = L - 0.0894841775 * a - 1.291485548 * b;

  const l_ = l1 * l1 * l1;
  const m_ = m1 * m1 * m1;
  const s_ = s1 * s1 * s1;

  const lr = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

  const delinear = (v: number) => {
    v = Math.max(0, v);
    return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };

  return {
    r: clamp(Math.round(delinear(lr) * 255), 0, 255),
    g: clamp(Math.round(delinear(lg) * 255), 0, 255),
    b: clamp(Math.round(delinear(lb) * 255), 0, 255),
  };
}

// HWB → RGB
export function hwbToRgb(h: number, w: number, bk: number) {
  w /= 100;
  bk /= 100;
  if (w + bk >= 1) {
    const gray = Math.round((w / (w + bk)) * 255);
    return { r: gray, g: gray, b: gray };
  }
  const { r, g, b } = hslToRgb(h, 100, 50);
  const f = (v: number) => Math.round((v / 255) * (1 - w - bk) * 255 + w * 255);
  return {
    r: clamp(f(r), 0, 255),
    g: clamp(f(g), 0, 255),
    b: clamp(f(b), 0, 255),
  };
}

// CMYK → RGB
export function cmykToRgb(c: number, m: number, y: number, k: number) {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}

// Flexible number separator: comma, space, or slash
const SEP = "[,\\s/]+";

// Convert from any supported input
export function parseColor(input: string): ColorFormats | null {
  const s = input.trim();

  // HEX (#RGB, #RRGGBB, #RRGGBBAA)
  const hexMatch = s.match(/^#?([a-f\d]{8}|[a-f\d]{6}|[a-f\d]{3,4})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    let alpha = 1;
    if (hex.length === 4) {
      alpha = parseInt(hex[3] + hex[3], 16) / 255;
      hex = hex.slice(0, 3);
    }
    if (hex.length === 8) {
      alpha = parseInt(hex.slice(6, 8), 16) / 255;
      hex = hex.slice(0, 6);
    }
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const rgb = hexToRgb("#" + hex);
    if (!rgb) return null;
    return buildFormats(rgb.r, rgb.g, rgb.b, round(alpha, 2));
  }

  // rgb/rgba — supports commas, spaces, slashes
  const rgbMatch = s.match(
    new RegExp(
      `^rgba?\\(\\s*(\\d+)${SEP}(\\d+)${SEP}(\\d+)(?:${SEP}([\\d.]+%?))?\\s*\\)$`,
      "i",
    ),
  );
  if (rgbMatch) {
    const a = rgbMatch[4]
      ? rgbMatch[4].endsWith("%")
        ? parseFloat(rgbMatch[4]) / 100
        : +rgbMatch[4]
      : 1;
    return buildFormats(+rgbMatch[1], +rgbMatch[2], +rgbMatch[3], a);
  }

  // hsl/hsla
  const hslMatch = s.match(
    new RegExp(
      `^hsla?\\(\\s*([\\d.]+)(?:deg)?${SEP}([\\d.]+)%?${SEP}([\\d.]+)%?(?:${SEP}([\\d.]+%?))?\\s*\\)$`,
      "i",
    ),
  );
  if (hslMatch) {
    const a = hslMatch[4]
      ? hslMatch[4].endsWith("%")
        ? parseFloat(hslMatch[4]) / 100
        : +hslMatch[4]
      : 1;
    const { r, g, b } = hslToRgb(+hslMatch[1], +hslMatch[2], +hslMatch[3]);
    return buildFormats(r, g, b, a);
  }

  // hwb
  const hwbMatch = s.match(
    new RegExp(
      `^hwb\\(\\s*([\\d.]+)(?:deg)?${SEP}([\\d.]+)%?${SEP}([\\d.]+)%?(?:${SEP}([\\d.]+%?))?\\s*\\)$`,
      "i",
    ),
  );
  if (hwbMatch) {
    const a = hwbMatch[4]
      ? hwbMatch[4].endsWith("%")
        ? parseFloat(hwbMatch[4]) / 100
        : +hwbMatch[4]
      : 1;
    const { r, g, b } = hwbToRgb(+hwbMatch[1], +hwbMatch[2], +hwbMatch[3]);
    return buildFormats(r, g, b, a);
  }

  // oklch
  const oklchMatch = s.match(
    new RegExp(
      `^oklch\\(\\s*([\\d.]+)${SEP}([\\d.]+)${SEP}([\\d.]+)(?:${SEP}([\\d.]+%?))?\\s*\\)$`,
      "i",
    ),
  );
  if (oklchMatch) {
    const a = oklchMatch[4]
      ? oklchMatch[4].endsWith("%")
        ? parseFloat(oklchMatch[4]) / 100
        : +oklchMatch[4]
      : 1;
    const { r, g, b } = oklchToRgb(
      +oklchMatch[1],
      +oklchMatch[2],
      +oklchMatch[3],
    );
    return buildFormats(r, g, b, a);
  }

  // cmyk
  const cmykMatch = s.match(
    new RegExp(
      `^cmyk\\(\\s*([\\d.]+)%?${SEP}([\\d.]+)%?${SEP}([\\d.]+)%?${SEP}([\\d.]+)%?\\s*\\)$`,
      "i",
    ),
  );
  if (cmykMatch) {
    const { r, g, b } = cmykToRgb(
      +cmykMatch[1],
      +cmykMatch[2],
      +cmykMatch[3],
      +cmykMatch[4],
    );
    return buildFormats(r, g, b, 1);
  }

  // Named CSS colors (common ones)
  const named: Record<string, string> = {
    red: "#ff0000",
    green: "#008000",
    blue: "#0000ff",
    white: "#ffffff",
    black: "#000000",
    yellow: "#ffff00",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    orange: "#ffa500",
    purple: "#800080",
    pink: "#ffc0cb",
    gray: "#808080",
    grey: "#808080",
    lime: "#00ff00",
    navy: "#000080",
    teal: "#008080",
    maroon: "#800000",
    olive: "#808000",
    aqua: "#00ffff",
    coral: "#ff7f50",
    salmon: "#fa8072",
    indigo: "#4b0082",
    violet: "#ee82ee",
    tomato: "#ff6347",
    gold: "#ffd700",
    silver: "#c0c0c0",
    chocolate: "#d2691e",
    crimson: "#dc143c",
    turquoise: "#40e0d0",
  };
  const lower = s.toLowerCase();
  if (named[lower]) {
    const rgb = hexToRgb(named[lower]);
    if (rgb) return buildFormats(rgb.r, rgb.g, rgb.b, 1);
  }

  return null;
}

export function buildFormats(
  r: number,
  g: number,
  b: number,
  a: number,
): ColorFormats {
  r = clamp(Math.round(r), 0, 255);
  g = clamp(Math.round(g), 0, 255);
  b = clamp(Math.round(b), 0, 255);
  a = clamp(a, 0, 1);
  const hsl = rgbToHsl(r, g, b);
  const hwb = rgbToHwb(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);
  const oklch = rgbToOklch(r, g, b);
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    rgba: { r, g, b, a },
    hsl,
    hsla: { ...hsl, a },
    hwb,
    oklch,
    cmyk,
  };
}

export function formatColorString(
  format: keyof ColorFormats,
  formats: ColorFormats,
): string {
  switch (format) {
    case "hex":
      return formats.hex;
    case "rgb":
      return `rgb(${formats.rgb.r}, ${formats.rgb.g}, ${formats.rgb.b})`;
    case "rgba":
      return `rgba(${formats.rgba.r}, ${formats.rgba.g}, ${formats.rgba.b}, ${formats.rgba.a})`;
    case "hsl":
      return `hsl(${formats.hsl.h}, ${formats.hsl.s}%, ${formats.hsl.l}%)`;
    case "hsla":
      return `hsla(${formats.hsla.h}, ${formats.hsla.s}%, ${formats.hsla.l}%, ${formats.hsla.a})`;
    case "hwb":
      return `hwb(${formats.hwb.h} ${formats.hwb.w}% ${formats.hwb.b}%)`;
    case "oklch":
      return `oklch(${formats.oklch.l} ${formats.oklch.c} ${formats.oklch.h})`;
    case "cmyk":
      return `cmyk(${formats.cmyk.c}%, ${formats.cmyk.m}%, ${formats.cmyk.y}%, ${formats.cmyk.k}%)`;
  }
}
