/**
 * useMOTD Hook
 * 
 * Returns today's Message of the Day.
 * Selection is deterministic based on day of year.
 */

import { useMemo } from 'react';
import { getDayOfYear } from '@/services/date-utils';
import { getMOTDByDayOfYear } from '@/data/default-motd';

interface UseMOTDReturn {
  motd: string;
  dayOfYear: number;
}

export function useMOTD(): UseMOTDReturn {
  const dayOfYear = useMemo(() => getDayOfYear(), []);
  const motd = useMemo(() => getMOTDByDayOfYear(dayOfYear), [dayOfYear]);

  return {
    motd,
    dayOfYear,
  };
}

