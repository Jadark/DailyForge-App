/**
 * DailyForge Type Definitions
 * 
 * Core types for goals, stats, and user profile.
 * These types mirror the SwiftUI implementation behavior.
 */

// ============================================================
// Goal Types
// ============================================================

export interface GoalDetail {
  id: string;
  text: string;
  createdAt: string; // ISO 8601 timestamp
}

export type GoalStatus = 'in_progress' | 'completed';

export interface Goal {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD in local timezone
  status: GoalStatus;
  details: GoalDetail[];
  createdAt: string; // ISO 8601 timestamp
  completedAt?: string; // ISO 8601 timestamp, set when completed
}

// ============================================================
// Stats Types
// ============================================================

export interface Stats {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  /** Date of last completion in YYYY-MM-DD format */
  lastCompletedDate: string | null;
}

// ============================================================
// Daily Record (for history/archiving)
// ============================================================

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  goal: Goal | null;
  completed: boolean;
}

// ============================================================
// User Profile
// ============================================================

export interface UserProfile {
  name: string;
  createdAt: string; // ISO 8601 timestamp
}

// ============================================================
// App State
// ============================================================

export interface AppState {
  isOnboardingComplete: boolean;
  lastOpenedDate: string | null; // YYYY-MM-DD, for rollover detection
  notificationsEnabled: boolean; // User preference for notifications
}

// ============================================================
// Storage Keys (centralized for consistency)
// ============================================================

export const STORAGE_KEYS = {
  USER_PROFILE: 'dailyforge_user_profile',
  CURRENT_GOAL: 'dailyforge_current_goal',
  STATS: 'dailyforge_stats',
  APP_STATE: 'dailyforge_app_state',
  DAILY_RECORDS: 'dailyforge_daily_records',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

