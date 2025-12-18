/**
 * useUserProfile Hook
 * 
 * Manages user profile data (name).
 */

import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, setUserProfile } from '@/services/storage';
import { UserProfile } from '@/types';
import { getISOTimestamp } from '@/services/date-utils';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  updateName: (name: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('[useUserProfile] Failed to load:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateName = useCallback(async (name: string): Promise<boolean> => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) return false;

    const updatedProfile: UserProfile = {
      name: trimmedName,
      createdAt: profile?.createdAt ?? getISOTimestamp(),
    };

    const success = await setUserProfile(updatedProfile);
    if (success) {
      setProfile(updatedProfile);
    }
    return success;
  }, [profile?.createdAt]);

  return {
    profile,
    isLoading,
    updateName,
    refresh: loadProfile,
  };
}

