import { hexToLinear } from './util';

export type PaletteKey =
  | 'ink'
  | 'ink2'
  | 'graphite'
  | 'ash'
  | 'bone'
  | 'signal'
  | 'ember'
  | 'blood'
  | 'acid';

export interface ThemeConfig {
  id: string;
  name: string;
  tagline: string;
  hex: Record<PaletteKey, string>;
  halationTint: [number, number, number];
  bloomMult: number;
}

export const THEMES: Record<string, ThemeConfig> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    tagline: 'Neo-Tokyo • Electric Cyan & Hot Magenta',
    hex: {
      ink: '#050811',
      ink2: '#0c1220',
      graphite: '#34495e',
      ash: '#7795b5',
      bone: '#e8f4fc',
      signal: '#00f0ff',
      ember: '#7df9ff',
      blood: '#006594',
      acid: '#ff0077',
    },
    halationTint: [0.05, 0.85, 1.0],
    bloomMult: 1.25,
  },
  solarpunk: {
    id: 'solarpunk',
    name: 'Solar Gold',
    tagline: 'Imperial 24K Gold • Celestial Flare',
    hex: {
      ink: '#0b0805',
      ink2: '#18120c',
      graphite: '#5e4e3c',
      ash: '#9e8d77',
      bone: '#fff6e5',
      signal: '#ffb300',
      ember: '#ffe57f',
      blood: '#c46500',
      acid: '#00e5ff',
    },
    halationTint: [1.0, 0.72, 0.15],
    bloomMult: 1.15,
  },
  matrix: {
    id: 'matrix',
    name: 'Phosphor Matrix',
    tagline: 'Neural CRT • Terminal Emerald & Lime',
    hex: {
      ink: '#030804',
      ink2: '#08140a',
      graphite: '#254429',
      ash: '#61966a',
      bone: '#e6ffe9',
      signal: '#00ff66',
      ember: '#94ff4d',
      blood: '#00571c',
      acid: '#ffc400',
    },
    halationTint: [0.15, 1.0, 0.3],
    bloomMult: 1.2,
  },
  ultraviolet: {
    id: 'ultraviolet',
    name: 'Ultraviolet',
    tagline: 'Cosmic Singularity • Neon Amethyst & Orchid',
    hex: {
      ink: '#07040e',
      ink2: '#130a22',
      graphite: '#4c3366',
      ash: '#9273b3',
      bone: '#f6eeff',
      signal: '#cf33ff',
      ember: '#ffa8fe',
      blood: '#6e00a8',
      acid: '#00ffd5',
    },
    halationTint: [0.85, 0.25, 1.0],
    bloomMult: 1.25,
  },
  bloodmoon: {
    id: 'bloodmoon',
    name: 'Blood Moon',
    tagline: 'Apocalyptic Laser Crimson • Scarlet Ember',
    hex: {
      ink: '#0b0505',
      ink2: '#180b0b',
      graphite: '#593b3b',
      ash: '#9c7373',
      bone: '#fceeed',
      signal: '#ff1744',
      ember: '#ff6d00',
      blood: '#850014',
      acid: '#ffe600',
    },
    halationTint: [1.0, 0.12, 0.12],
    bloomMult: 1.3,
  },
  arctic: {
    id: 'arctic',
    name: 'Arctic Frost',
    tagline: 'Deep Space Ion • Electric Azure & Glacier',
    hex: {
      ink: '#05080e',
      ink2: '#0a121d',
      graphite: '#364c61',
      ash: '#7899b8',
      bone: '#e8f4fc',
      signal: '#29b6f6',
      ember: '#81d4fa',
      blood: '#00528f',
      acid: '#ff3d00',
    },
    halationTint: [0.2, 0.65, 1.0],
    bloomMult: 1.15,
  },
  hazard: {
    id: 'hazard',
    name: 'Hazard Orange',
    tagline: 'Original Classic • Hazard Orange & Bone',
    hex: {
      ink: '#0A0A0B',
      ink2: '#151517',
      graphite: '#5E5B57',
      ash: '#9C978F',
      bone: '#EEE9DF',
      signal: '#FF4D12',
      ember: '#FF8A3D',
      blood: '#C21D0B',
      acid: '#D8FF3C',
    },
    halationTint: [1.0, 0.18, 0.04],
    bloomMult: 1.0,
  },
};

function detectTheme(): string {
  if (typeof window !== 'undefined' && window.location) {
    const p = new URLSearchParams(window.location.search);
    const qTheme = p.get('theme');
    if (qTheme && THEMES[qTheme]) return qTheme;
    try {
      const stored = localStorage.getItem('pdoom_theme');
      if (stored && THEMES[stored]) return stored;
    } catch { /* noop */ }
  }
  if (typeof process !== 'undefined' && process.env?.PDOOM_THEME && THEMES[process.env.PDOOM_THEME]) {
    return process.env.PDOOM_THEME;
  }
  return 'cyberpunk';
}

export const CURRENT_THEME_ID = detectTheme();
export const CURRENT_THEME: ThemeConfig = THEMES[CURRENT_THEME_ID] || THEMES.cyberpunk;

export const HEX: Record<PaletteKey, string> = { ...CURRENT_THEME.hex };

/** Linear RGB triplets for GL uniforms. */
export const LIN: Record<PaletteKey, [number, number, number]> = Object.fromEntries(
  Object.entries(HEX).map(([k, v]) => [k, hexToLinear(v)]),
) as Record<PaletteKey, [number, number, number]>;

/** CSS rgba() for Canvas2D. */
export function rgba(key: PaletteKey | string, a = 1): string {
  const hex = (HEX as Record<string, string>)[key] ?? key;
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Mutates active palette in-place. */
export function applyTheme(id: string) {
  if (!THEMES[id]) return;
  const t = THEMES[id];
  try {
    localStorage.setItem('pdoom_theme', id);
  } catch { /* noop */ }
  for (const k of Object.keys(t.hex) as PaletteKey[]) {
    HEX[k] = t.hex[k];
    LIN[k] = hexToLinear(t.hex[k]);
  }
}
