/**
 * Date Utilities
 * 
 * All date operations use local timezone.
 * Format: YYYY-MM-DD for date strings.
 */

// ============================================================
// Date Formatting
// ============================================================

/**
 * Returns the current local date as YYYY-MM-DD string
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the current ISO 8601 timestamp
 */
export function getISOTimestamp(): string {
  return new Date().toISOString();
}

// ============================================================
// Date Comparisons
// ============================================================

/**
 * Checks if two date strings represent the same calendar day
 */
export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

/**
 * Checks if date1 is the day before date2
 */
export function isYesterday(date1: string, date2: string): boolean {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  const diff = d2.getTime() - d1.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  return diff === oneDay;
}

/**
 * Checks if the given date string is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getLocalDateString();
}

/**
 * Checks if date1 is before date2
 */
export function isBefore(date1: string, date2: string): boolean {
  return date1 < date2;
}

// ============================================================
// Day of Year (for MOTD selection)
// ============================================================

/**
 * Returns the day of year (1-366) for deterministic MOTD selection
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneDay);
}

// ============================================================
// Time of Day (for greeting)
// ============================================================

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

/**
 * Returns the time of day based on local hour
 * - 5:00 AM – 11:59 AM: morning
 * - 12:00 PM – 4:59 PM: afternoon
 * - 5:00 PM – 4:59 AM: evening
 */
export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

/**
 * Returns the appropriate greeting based on time of day
 */
export function getGreeting(name: string, date: Date = new Date()): string {
  const timeOfDay = getTimeOfDay(date);
  
  switch (timeOfDay) {
    case 'morning':
      return `Good Morning ${name}`;
    case 'afternoon':
      return `Good Afternoon ${name}`;
    case 'evening':
      return `Hello ${name}`;
  }
}

// ============================================================
// Rollover Detection
// ============================================================

/**
 * Checks if a day rollover has occurred since the last opened date
 * Returns true if lastOpenedDate is null or is a different day than today
 */
export function hasRolledOver(lastOpenedDate: string | null): boolean {
  if (lastOpenedDate === null) return false; // First launch, no rollover
  return lastOpenedDate !== getLocalDateString();
}

// ============================================================
// Streak Calculation Helpers
// ============================================================

/**
 * Calculates whether the streak should continue, increment, or reset
 * based on the last completed date
 */
export function calculateStreakAction(
  lastCompletedDate: string | null,
  today: string = getLocalDateString()
): 'continue' | 'increment' | 'reset' {
  if (lastCompletedDate === null) {
    return 'increment'; // First completion ever
  }
  
  if (isSameDay(lastCompletedDate, today)) {
    return 'continue'; // Already completed today
  }
  
  if (isYesterday(lastCompletedDate, today)) {
    return 'increment'; // Consecutive day
  }
  
  return 'reset'; // Streak broken
}

