/**
 * useDailyGoal Hook
 * 
 * Manages the current day's goal state.
 * Handles creation, completion, and rollover.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentGoal,
  setCurrentGoal,
  clearCurrentGoal,
  addDailyRecord,
  getAppState,
  setAppState,
} from '@/services/storage';
import { Goal, GoalDetail, GoalStatus } from '@/types';
import {
  getLocalDateString,
  getISOTimestamp,
  isToday,
  hasRolledOver,
} from '@/services/date-utils';

interface UseDailyGoalReturn {
  goal: Goal | null;
  isLoading: boolean;
  hasGoalToday: boolean;
  isCompleted: boolean;
  setGoal: (text: string) => Promise<boolean>;
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
        setGoalState(data);
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
  const setGoal = useCallback(async (text: string): Promise<boolean> => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) return false;

    const today = getLocalDateString();
    const newGoal: Goal = {
      id: generateId(),
      text: trimmedText,
      date: today,
      status: 'in_progress',
      details: [],
      createdAt: getISOTimestamp(),
    };

    const success = await setCurrentGoal(newGoal);
    if (success) {
      setGoalState(newGoal);
    }
    return success;
  }, []);

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
    markComplete,
    markNotComplete,
    addDetail,
    checkRollover,
    refresh: loadGoal,
  };
}

