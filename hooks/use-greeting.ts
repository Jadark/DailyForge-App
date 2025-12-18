/**
 * useGreeting Hook
 * 
 * Returns a time-based greeting with the user's name.
 */

import { useState, useEffect } from 'react';
import { getGreeting, getTimeOfDay, TimeOfDay } from '@/services/date-utils';

interface UseGreetingReturn {
  greeting: string;
  timeOfDay: TimeOfDay;
}

export function useGreeting(name: string): UseGreetingReturn {
  const [greeting, setGreeting] = useState(() => getGreeting(name));
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => getTimeOfDay());

  useEffect(() => {
    // Update greeting when name changes
    setGreeting(getGreeting(name));
    setTimeOfDay(getTimeOfDay());
  }, [name]);

  useEffect(() => {
    // Check for time of day changes every minute
    const interval = setInterval(() => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
        setGreeting(getGreeting(name));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [name, timeOfDay]);

  return {
    greeting,
    timeOfDay,
  };
}

