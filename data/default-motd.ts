/**
 * Default Message of the Day (MOTD) List
 * 
 * These messages are displayed to users daily.
 * Selection is deterministic based on day of year.
 * Themes can override this list with custom messages.
 */

export const DEFAULT_MOTD_LIST: readonly string[] = [
  'One clear goal is enough for today.',
  'Focus beats busy. Pick the one thing.',
  'Progress starts with choosing.',
  'Small effort. Real momentum.',
  'Today only asks for one win.',
  'Clarity creates action.',
  'Decide once. Then follow through.',
  'One goal. One direction.',
  "You don't need more time—just focus.",
  'Make today count in a simple way.',
  'Finish one thing well.',
  'A single step forward still moves you ahead.',
  'Focus is a decision, not a feeling.',
  'What matters today is manageable.',
  'Choose the goal that makes the rest quieter.',
  'Completion beats perfection.',
  'Start small. End strong.',
  'One goal done is a good day.',
  'Momentum comes from finishing.',
  'Keep it simple. Do the work.',
] as const;

/**
 * Returns the MOTD for a given day of year
 * Uses modulo to cycle through the list
 */
export function getMOTDByDayOfYear(dayOfYear: number): string {
  const index = dayOfYear % DEFAULT_MOTD_LIST.length;
  return DEFAULT_MOTD_LIST[index];
}

