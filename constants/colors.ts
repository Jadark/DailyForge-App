/**
 * DailyForge Color Constants
 * 
 * Apple system colors for card states.
 * These are the default (no theme) colors.
 */

// ============================================================
// Card State Colors
// ============================================================

export const CardColors = {
  /** Gray - No goal set (empty state) */
  empty: {
    light: '#8E8E93',     // Apple systemGray
    dark: '#8E8E93',
  },
  /** Blue - Goal in progress */
  inProgress: {
    light: '#007AFF',     // Apple systemBlue
    dark: '#0A84FF',      // Apple systemBlue (dark)
  },
  /** Green - Goal completed */
  completed: {
    light: '#34C759',     // Apple systemGreen
    dark: '#30D158',      // Apple systemGreen (dark)
  },
} as const;

// ============================================================
// Card Background Colors (lighter versions for card fill)
// ============================================================

export const CardBackgroundColors = {
  empty: {
    light: '#F2F2F7',     // Apple systemGray6
    dark: '#1C1C1E',      // Apple systemGray6 (dark)
  },
  inProgress: {
    light: '#E5F2FF',     // Light blue tint
    dark: '#0A84FF1A',    // Blue with low opacity
  },
  completed: {
    light: '#E8F9ED',     // Light green tint
    dark: '#30D1581A',    // Green with low opacity
  },
} as const;

// ============================================================
// Text Colors
// ============================================================

export const TextColors = {
  primary: {
    light: '#000000',
    dark: '#FFFFFF',
  },
  secondary: {
    light: '#3C3C43',     // Apple secondaryLabel
    dark: '#EBEBF5',      // Apple secondaryLabel (dark) with 60% opacity
  },
  tertiary: {
    light: '#8E8E93',     // Apple systemGray
    dark: '#8E8E93',
  },
} as const;

// ============================================================
// Helper to get color by scheme
// ============================================================

export type ColorScheme = 'light' | 'dark';

export function getCardColor(
  state: 'empty' | 'inProgress' | 'completed',
  scheme: ColorScheme = 'light'
): string {
  return CardColors[state][scheme];
}

export function getCardBackgroundColor(
  state: 'empty' | 'inProgress' | 'completed',
  scheme: ColorScheme = 'light'
): string {
  return CardBackgroundColors[state][scheme];
}

