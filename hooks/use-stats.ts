/**
 * useStats Hook
 * 
 * Manages streak and completion statistics.
 * Updates are triggered by goal completion.
 */

import { useState, useEffect, useCallback } from 'react';
import { getStats, setStats } from '@/services/storage';
import { Stats } from '@/types';
import {
  getLocalDateString,
  calculateStreakAction,
  isSameDay,
} from '@/services/date-utils';

interface UseStatsReturn {
  stats: Stats;
  isLoading: boolean;
  recordCompletion: () => Promise<boolean>;
  revertCompletion: () => Promise<boolean>;
  refresh: () => Promise<void>;
  completionRate: number;
}

const DEFAULT_STATS: Stats = {
  currentStreak: 0,
  longestStreak: 0,
  totalCompleted: 0,
  lastCompletedDate: null,
};

export function useStats(): UseStatsReturn {
  const [stats, setStatsState] = useState<Stats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getStats();
      setStatsState(data);
    } catch (error) {
      console.error('[useStats] Failed to load:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  /**
   * Record a goal completion for today
   * Only increments streak once per day
   */
  const recordCompletion = useCallback(async (): Promise<boolean> => {
    const today = getLocalDateString();
    const action = calculateStreakAction(stats.lastCompletedDate, today);

    let newStats: Stats;

    switch (action) {
      case 'continue':
        // Already completed today, no change
        return true;
      
      case 'increment':
        // Consecutive day or first completion
        newStats = {
          currentStreak: stats.currentStreak + 1,
          longestStreak: Math.max(stats.longestStreak, stats.currentStreak + 1),
          totalCompleted: stats.totalCompleted + 1,
          lastCompletedDate: today,
        };
        break;
      
      case 'reset':
        // Streak broken, start fresh
        newStats = {
          currentStreak: 1,
          longestStreak: Math.max(stats.longestStreak, 1),
          totalCompleted: stats.totalCompleted + 1,
          lastCompletedDate: today,
        };
        break;
    }

    const success = await setStats(newStats);
    if (success) {
      setStatsState(newStats);
    }
    return success;
  }, [stats]);

  /**
   * Revert today's completion (when marking goal as not complete)
   * Only applies if last completion was today
   */
  const revertCompletion = useCallback(async (): Promise<boolean> => {
    const today = getLocalDateString();
    
    // Only revert if the last completion was today
    if (!stats.lastCompletedDate || !isSameDay(stats.lastCompletedDate, today)) {
      return false;
    }

    // This is a simplified revert - we decrement but can't fully restore
    // the previous state without more complex history tracking
    const newStats: Stats = {
      currentStreak: Math.max(0, stats.currentStreak - 1),
      longestStreak: stats.longestStreak, // Don't change longest
      totalCompleted: Math.max(0, stats.totalCompleted - 1),
      lastCompletedDate: null, // Clear last completed date
    };

    const success = await setStats(newStats);
    if (success) {
      setStatsState(newStats);
    }
    return success;
  }, [stats]);

  // Calculate completion rate (requires knowing total days tracked)
  // For now, this is just a placeholder - would need daily records to calculate
  const completionRate = stats.totalCompleted > 0 ? 100 : 0;

  return {
    stats,
    isLoading,
    recordCompletion,
    revertCompletion,
    refresh: loadStats,
    completionRate,
  };
}

