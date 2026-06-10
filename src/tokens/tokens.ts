export const tokens = {
  color: {
    // Text
    text:        '#1a1a1a',
    textSecond:  '#4a4a4a',
    textMuted:   '#6b6b6b',
    textSubtle:  '#aaaaaa',
    textInverse: '#ffffff',
    // Brand
    brand:       '#d97757',
    brandDark:   '#c4663f',
    // Blue
    blue:        '#1a56b0',
    blueDark:    '#1446a0',
    blueLight:   '#e8f0fe',
    // Green
    green:       '#1a6b3a',
    greenLight:  '#d4edda',
    // Red
    red:         '#9b2c2c',
    redLight:    '#fde8e8',
    error:       '#e53e3e',
    // Surface
    pageBg:      '#f0ede8',
    white:       '#ffffff',
    // Border
    border:      '#e0ddd6',
    borderStrong: '#d0cdc5',
  },
  spacing: {
    0:  0,
    1:  4,
    2:  8,
    3:  12,
    4:  16,
    5:  20,
    6:  24,
    7:  28,
    8:  32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
  },
  radius: {
    sm:   4,
    md:   6,
    lg:   8,
    card: 10,
    xl:   12,
    pill: 9999,
  },
  shadow: {
    sm:   '0 1px 2px rgba(0,0,0,0.06)',
    md:   '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    card: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
    lg:   '0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
    focus: '0 0 0 3px rgba(26,86,176,0.25)',
  },
  fontSize: {
    caption: '12px',
    label:   '11px',
    small:   '13px',
    body:    '14px',
    bodyMd:  '15px',
    h4:      '16px',
    h3:      '18px',
    h2:      '22px',
    h1:      '28px',
  },
} as const

export type ColorToken   = keyof typeof tokens.color
export type SpacingToken = keyof typeof tokens.spacing
export type RadiusToken  = keyof typeof tokens.radius
export type ShadowToken  = keyof typeof tokens.shadow
export type FontSizeToken = keyof typeof tokens.fontSize

// Focus ring — standard PS implementation
export const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1'

// Disabled state — standard PS implementation
export const DISABLED = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
