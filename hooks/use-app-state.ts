/**
 * useAppState Hook
 * 
 * Manages app-level state (onboarding status, last opened date).
 */

import { useState, useEffect, useCallback } from 'react';
import { getAppState, setAppState } from '@/services/storage';
import { AppState } from '@/types';
import { getLocalDateString } from '@/services/date-utils';

interface UseAppStateReturn {
  appState: AppState | null;
  isLoading: boolean;
  isOnboardingComplete: boolean;
  markOnboardingComplete: () => Promise<boolean>;
  updateLastOpenedDate: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useAppState(): UseAppStateReturn {
  const [appState, setAppStateLocal] = useState<AppState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadState = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAppState();
      setAppStateLocal(data);
    } catch (error) {
      console.error('[useAppState] Failed to load:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const markOnboardingComplete = useCallback(async (): Promise<boolean> => {
    const newState: AppState = {
      isOnboardingComplete: true,
      lastOpenedDate: getLocalDateString(),
    };
    
    const success = await setAppState(newState);
    if (success) {
      setAppStateLocal(newState);
    }
    return success;
  }, []);

  const updateLastOpenedDate = useCallback(async (): Promise<boolean> => {
    if (!appState) return false;
    
    const newState: AppState = {
      ...appState,
      lastOpenedDate: getLocalDateString(),
    };
    
    const success = await setAppState(newState);
    if (success) {
      setAppStateLocal(newState);
    }
    return success;
  }, [appState]);

  return {
    appState,
    isLoading,
    isOnboardingComplete: appState?.isOnboardingComplete ?? false,
    markOnboardingComplete,
    updateLastOpenedDate,
    refresh: loadState,
  };
}

