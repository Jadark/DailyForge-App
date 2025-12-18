/**
 * Storage Service
 * 
 * AsyncStorage wrapper for persisting app data.
 * Provides type-safe get/set operations with error handling.
 */

import {
  AppState,
  DailyRecord,
  Goal,
  Stats,
  STORAGE_KEYS,
  UserProfile,
} from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// Generic Storage Operations
// ============================================================

async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`[Storage] Failed to get item "${key}":`, error);
    return null;
  }
}

async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to set item "${key}":`, error);
    return false;
  }
}

async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to remove item "${key}":`, error);
    return false;
  }
}

// ============================================================
// User Profile
// ============================================================

export async function getUserProfile(): Promise<UserProfile | null> {
  return getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
}

export async function setUserProfile(profile: UserProfile): Promise<boolean> {
  return setItem(STORAGE_KEYS.USER_PROFILE, profile);
}

// ============================================================
// Current Goal
// ============================================================

export async function getCurrentGoal(): Promise<Goal | null> {
  return getItem<Goal>(STORAGE_KEYS.CURRENT_GOAL);
}

export async function setCurrentGoal(goal: Goal): Promise<boolean> {
  return setItem(STORAGE_KEYS.CURRENT_GOAL, goal);
}

export async function clearCurrentGoal(): Promise<boolean> {
  return removeItem(STORAGE_KEYS.CURRENT_GOAL);
}

// ============================================================
// Stats
// ============================================================

const DEFAULT_STATS: Stats = {
  currentStreak: 0,
  longestStreak: 0,
  totalCompleted: 0,
  lastCompletedDate: null,
  tagCounts: {
    general: 0,
    personal_health: 0,
    work_school: 0,
  },
};

export async function getStats(): Promise<Stats> {
  const stats = await getItem<Stats>(STORAGE_KEYS.STATS);
  if (!stats) {
    return DEFAULT_STATS;
  }
  // Ensure tagCounts exists for backward compatibility
  if (!stats.tagCounts) {
    return {
      ...stats,
      tagCounts: DEFAULT_STATS.tagCounts,
    };
  }
  return stats;
}

export async function setStats(stats: Stats): Promise<boolean> {
  return setItem(STORAGE_KEYS.STATS, stats);
}

// ============================================================
// App State
// ============================================================

const DEFAULT_APP_STATE: AppState = {
  isOnboardingComplete: false,
  lastOpenedDate: null,
  notificationsEnabled: true, // Default to enabled
};

export async function getAppState(): Promise<AppState> {
  const state = await getItem<AppState>(STORAGE_KEYS.APP_STATE);
  return state ?? DEFAULT_APP_STATE;
}

export async function setAppState(state: AppState): Promise<boolean> {
  return setItem(STORAGE_KEYS.APP_STATE, state);
}

// ============================================================
// Daily Records (History)
// ============================================================

export async function getDailyRecords(): Promise<DailyRecord[]> {
  const records = await getItem<DailyRecord[]>(STORAGE_KEYS.DAILY_RECORDS);
  return records ?? [];
}

export async function addDailyRecord(record: DailyRecord): Promise<boolean> {
  const records = await getDailyRecords();
  // Prevent duplicates for the same date
  const filtered = records.filter((r) => r.date !== record.date);
  filtered.push(record);
  return setItem(STORAGE_KEYS.DAILY_RECORDS, filtered);
}

// ============================================================
// Debug / Reset (development only)
// ============================================================

export async function clearAllStorage(): Promise<void> {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    console.log('[Storage] All data cleared');
  } catch (error) {
    console.error('[Storage] Failed to clear all data:', error);
  }
}

