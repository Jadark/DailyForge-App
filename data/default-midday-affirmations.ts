/**
 * Default Midday Positive Affirmations List
 * 
 * These messages are sent at 2:30 PM as positive reinforcement.
 * Selection is random (unlike MOTD which is deterministic).
 * Themes can override this list with custom messages.
 */

export const DEFAULT_MIDDAY_AFFIRMATIONS: readonly string[] = [
  'You\'re doing better than you think.',
  'What you\'ve done today already counts.',
  'You can reset and keep going.',
  'One focused step is enough right now.',
  'You don\'t need to rush to make progress.',
  'You\'re still in control of today.',
  'Small effort is still forward motion.',
  'You can finish the day strong.',
  'Your focus matters more than perfection.',
  'You\'re closer than you were this morning.',
] as const;

/**
 * Returns a random affirmation from the list
 */
export function getRandomMiddayAffirmation(): string {
  const index = Math.floor(Math.random() * DEFAULT_MIDDAY_AFFIRMATIONS.length);
  return DEFAULT_MIDDAY_AFFIRMATIONS[index];
}
