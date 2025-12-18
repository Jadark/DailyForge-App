/**
 * Notification Service
 * 
 * Handles scheduling of daily notifications:
 * - 10:30 AM: MOTD + reminder to set goal (if no goal set)
 * - 2:30 PM: Positive reinforcement (TBD logic)
 * - 8:30 PM: Contextual based on goal state and streak (TBD logic)
 */

import { getMOTDByDayOfYear } from '@/data/default-motd';
import { getDayOfYear } from '@/services/date-utils';
import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Notification identifiers for cancellation
const NOTIFICATION_IDS = {
  MORNING_REMINDER: 'morning-reminder',
  AFTERNOON_REINFORCEMENT: 'afternoon-reinforcement',
  EVENING_CONTEXTUAL: 'evening-contextual',
} as const;

// ============================================================
// Permission Management
// ============================================================

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function getNotificationPermissionStatus(): Promise<string> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

// ============================================================
// Schedule Helpers
// ============================================================

function getNextOccurrence(hour: number, minute: number): Date {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  
  // If the time has already passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  
  return target;
}

// ============================================================
// Morning Notification (10:30 AM)
// ============================================================

export async function scheduleMorningReminder(hasGoalSet: boolean = false): Promise<void> {
  // Cancel existing morning reminder
  await cancelNotification(NOTIFICATION_IDS.MORNING_REMINDER);
  
  // Don't schedule if goal is already set
  if (hasGoalSet) {
    return;
  }

  // Get tomorrow's MOTD (since we're scheduling for the next occurrence)
  const targetDate = getNextOccurrence(10, 30);
  const dayOfYear = getDayOfYear(targetDate);
  const motd = getMOTDByDayOfYear(dayOfYear);

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.MORNING_REMINDER,
    content: {
      title: motd,
      body: "What's your one goal for today?",
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 10,
      minute: 30,
    },
  });
}

// ============================================================
// Afternoon Notification (2:30 PM)
// ============================================================

export async function scheduleAfternoonReinforcement(): Promise<void> {
  // Cancel existing
  await cancelNotification(NOTIFICATION_IDS.AFTERNOON_REINFORCEMENT);

  // Placeholder content - will be customized based on goal state
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.AFTERNOON_REINFORCEMENT,
    content: {
      title: 'Keep going! 💪',
      body: "You're making progress. Stay focused on your goal.",
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 14,
      minute: 30,
    },
  });
}

// ============================================================
// Evening Notification (8:30 PM)
// ============================================================

export async function scheduleEveningContextual(
  hasGoalSet: boolean = false,
  isCompleted: boolean = false,
  currentStreak: number = 0
): Promise<void> {
  // Cancel existing
  await cancelNotification(NOTIFICATION_IDS.EVENING_CONTEXTUAL);

  let title: string;
  let body: string;

  if (isCompleted) {
    // Goal completed
    if (currentStreak > 1) {
      title = `${currentStreak} day streak! 🔥`;
      body = 'Great work today. See you tomorrow.';
    } else {
      title = 'Goal complete! ✓';
      body = 'Well done. Rest up and come back tomorrow.';
    }
  } else if (hasGoalSet) {
    // Goal set but not completed
    title = 'Still time today';
    body = "Don't forget to complete your goal before midnight.";
  } else {
    // No goal set
    title = 'Day almost over';
    body = 'There\'s still time to set and complete a quick goal.';
  }

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.EVENING_CONTEXTUAL,
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 30,
    },
  });
}

// ============================================================
// Notification Management
// ============================================================

export async function cancelNotification(identifier: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

// ============================================================
// Initialize Notifications
// ============================================================

export async function initializeNotifications(
  hasGoalSet: boolean = false,
  isCompleted: boolean = false,
  currentStreak: number = 0
): Promise<void> {
  const hasPermission = await getNotificationPermissionStatus();
  
  if (hasPermission !== 'granted') {
    console.log('[Notifications] Permission not granted, skipping initialization');
    return;
  }

  // Schedule all notifications based on current state
  await scheduleMorningReminder(hasGoalSet);
  await scheduleAfternoonReinforcement();
  await scheduleEveningContextual(hasGoalSet, isCompleted, currentStreak);

  console.log('[Notifications] Initialized with state:', { hasGoalSet, isCompleted, currentStreak });
}

// ============================================================
// Update notifications when goal state changes
// ============================================================

export async function updateNotificationsOnGoalSet(): Promise<void> {
  // Cancel morning reminder since goal is now set
  await cancelNotification(NOTIFICATION_IDS.MORNING_REMINDER);
}

export async function updateNotificationsOnGoalComplete(currentStreak: number): Promise<void> {
  // Update evening notification with completion message
  await scheduleEveningContextual(true, true, currentStreak);
}

