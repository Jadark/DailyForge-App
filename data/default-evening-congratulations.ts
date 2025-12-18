/**
 * Default Evening Congratulations Messages
 * 
 * These messages are sent at 8:30 PM when a goal is completed
 * (but not on milestone streak days like 3, 7, 14, etc.)
 * Selection is random.
 * Themes can override this list with custom messages.
 */

export const DEFAULT_EVENING_CONGRATULATIONS: readonly string[] = [
  'Great work completing your goal today!',
  'You showed up and followed through — well done.',
  'Today counts because you did the work.',
  'Nice job finishing what you started.',
  'You made progress today — be proud of that.',
  'Another day, another win. Well done.',
  'You kept your focus and it paid off.',
  'You earned this sense of accomplishment.',
  'Strong finish — today\'s goal is complete.',
  'You did what you said you would. Great job.',
] as const;

/**
 * Returns a random congratulatory message from the list
 */
export function getRandomEveningCongratulations(): string {
  const index = Math.floor(Math.random() * DEFAULT_EVENING_CONGRATULATIONS.length);
  return DEFAULT_EVENING_CONGRATULATIONS[index];
}
