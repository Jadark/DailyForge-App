/**
 * useDailyGoal Hook
 * 
 * Manages the current day's goal state.
 * Handles creation, completion, and rollover.
 */

import {
  getISOTimestamp,
  getLocalDateString,
  hasRolledOver,
  isToday,
} from '@/services/date-utils';
import {
  addDailyRecord,
  clearCurrentGoal,
  getAppState,
  getCurrentGoal,
  getStats,
  setAppState,
  setCurrentGoal,
  setStats,
} from '@/services/storage';
import { Goal, GoalDetail, GoalTag } from '@/types';
import { useCallback, useEffect, useState } from 'react';

interface UseDailyGoalReturn {
  goal: Goal | null;
  isLoading: boolean;
  hasGoalToday: boolean;
  isCompleted: boolean;
  setGoal: (text: string, tag?: GoalTag) => Promise<boolean>;
  updateTag: (tag: GoalTag) => Promise<boolean>;
  markComplete: () => Promise<boolean>;
  markNotComplete: () => Promise<boolean>;
  addDetail: (text: string) => Promise<boolean>;
  checkRollover: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useDailyGoal(): UseDailyGoalReturn {
  const [goal, setGoalState] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadGoal = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCurrentGoal();
      
      // Check if goal is from today
      if (data && isToday(data.date)) {
        // Ensure tag exists for backward compatibility
        const goalWithTag: Goal = {
          ...data,
          tag: data.tag || 'general',
        };
        setGoalState(goalWithTag);
      } else {
        // Goal is from a previous day, clear it
        setGoalState(null);
      }
    } catch (error) {
      console.error('[useDailyGoal] Failed to load:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoal();
  }, [loadGoal]);

  /**
   * Check for day rollover and archive previous goal if needed
   * Also increments tag counts for the archived goal
   */
  const checkRollover = useCallback(async (): Promise<boolean> => {
    try {
      const appState = await getAppState();
      
      if (hasRolledOver(appState.lastOpenedDate)) {
        const currentGoal = await getCurrentGoal();
        
        // Archive previous goal if it exists
        if (currentGoal && !isToday(currentGoal.date)) {
          await addDailyRecord({
            date: currentGoal.date,
            goal: currentGoal,
            completed: currentGoal.status === 'completed',
          });

          // Increment tag count for the goal's tag (or general if no tag - backward compatibility)
          const stats = await getStats();
          const tagToIncrement: GoalTag = (currentGoal.tag as GoalTag) || 'general';
          const updatedStats = {
            ...stats,
            tagCounts: {
              ...stats.tagCounts,
              [tagToIncrement]: (stats.tagCounts[tagToIncrement] || 0) + 1,
            },
          };
          await setStats(updatedStats);

          await clearCurrentGoal();
          setGoalState(null);
        }

        // Update last opened date
        await setAppState({
          ...appState,
          lastOpenedDate: getLocalDateString(),
        });

        return true; // Rollover occurred
      }

      return false; // No rollover
    } catch (error) {
      console.error('[useDailyGoal] Rollover check failed:', error);
      return false;
    }
  }, []);

  /**
   * Set a new goal for today
   */
  const setGoal = useCallback(async (text: string, tag: GoalTag = 'general'): Promise<boolean> => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) return false;

    const today = getLocalDateString();
    const newGoal: Goal = {
      id: generateId(),
      text: trimmedText,
      date: today,
      status: 'in_progress',
      details: [],
      tag,
      createdAt: getISOTimestamp(),
    };

    const success = await setCurrentGoal(newGoal);
    if (success) {
      setGoalState(newGoal);
    }
    return success;
  }, []);

  /**
   * Update the tag for the current goal
   * Only allowed if goal is in progress and from today
   */
  const updateTag = useCallback(async (tag: GoalTag): Promise<boolean> => {
    if (!goal || goal.status === 'completed' || !isToday(goal.date)) {
      return false;
    }

    const updatedGoal: Goal = {
      ...goal,
      tag,
    };

    const success = await setCurrentGoal(updatedGoal);
    if (success) {
      setGoalState(updatedGoal);
    }
    return success;
  }, [goal]);

  /**
   * Mark the current goal as complete
   */
  const markComplete = useCallback(async (): Promise<boolean> => {
    if (!goal || goal.status === 'completed') return false;

    const updatedGoal: Goal = {
      ...goal,
      status: 'completed',
      completedAt: getISOTimestamp(),
    };

    const success = await setCurrentGoal(updatedGoal);
    if (success) {
      setGoalState(updatedGoal);
    }
    return success;
  }, [goal]);

  /**
   * Mark the current goal as not complete (revert)
   */
  const markNotComplete = useCallback(async (): Promise<boolean> => {
    if (!goal || goal.status !== 'completed') return false;

    const updatedGoal: Goal = {
      ...goal,
      status: 'in_progress',
      completedAt: undefined,
    };

    const success = await setCurrentGoal(updatedGoal);
    if (success) {
      setGoalState(updatedGoal);
    }
    return success;
  }, [goal]);

  /**
   * Add a detail/note to the current goal (append-only)
   */
  const addDetail = useCallback(async (text: string): Promise<boolean> => {
    if (!goal || goal.status === 'completed') return false;

    const trimmedText = text.trim();
    if (trimmedText.length === 0) return false;

    const newDetail: GoalDetail = {
      id: generateId(),
      text: trimmedText,
      createdAt: getISOTimestamp(),
    };

    const updatedGoal: Goal = {
      ...goal,
      details: [...goal.details, newDetail],
    };

    const success = await setCurrentGoal(updatedGoal);
    if (success) {
      setGoalState(updatedGoal);
    }
    return success;
  }, [goal]);

  return {
    goal,
    isLoading,
    hasGoalToday: goal !== null && isToday(goal.date),
    isCompleted: goal?.status === 'completed',
    setGoal,
    updateTag,
    markComplete,
    markNotComplete,
    addDetail,
    checkRollover,
    refresh: loadGoal,
  };
}

