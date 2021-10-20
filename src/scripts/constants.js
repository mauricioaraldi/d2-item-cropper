/* eslint object-property-newline: 0 */

/* Description BG */
export const DESCRIPTION_BG_COLOR = [
  [5, 5, 5],
];
export const DESCRIPTION_BG_THRESHOLD_MAX = 20;
export const DESCRIPTION_BG_THRESHOLD_MIN = 20;
export const DESCRIPTION_BG_PADDING = 25;

/* Description font */
export const DESCRIPTION_FONT_COLOR = [
  { /* Unique */
    color: [182, 167, 114],
    thresholdMax: 3,
    thresholdMin: 19,
  },
  { /* Rune word */
    color: [178, 170, 119],
    thresholdMax: 10,
    thresholdMin: 10,
  },
  { /* Set */
    color: [104, 254, 47],
    thresholdMax: 10,
    thresholdMin: 10,
  },
  { /* Socketed */
    color: [115, 115, 115],
    thresholdMax: 4,
    thresholdMin: 0,
  },
  { /* Rare */
    color: [253, 255, 110],
    thresholdMax: 20,
    thresholdMin: 20,
  },
  { /* Magic */
    color: [124, 109, 250],
    thresholdMax: 13,
    thresholdMin: 8,
  },
  { /* Normal */
    color: [253, 253, 253],
    thresholdMax: 16,
    thresholdMin: 0,
  },
  { /* Low Quality */
    color: [253, 253, 253],
    thresholdMax: 10,
    thresholdMin: 10,
  },
  { /* Crafted */
    color: [253, 253, 253],
    thresholdMax: 10,
    thresholdMin: 10,
  },
  { /* Ethereal */
    color: [253, 253, 253],
    thresholdMax: 10,
    thresholdMin: 10,
  },
];
export const REQUIRED_DESCRIPTION_FONT_MATCHES_IN_ROW = 4;
export const REQUIRED_BLACKBOX_MATCHES_IN_ROW = 1;