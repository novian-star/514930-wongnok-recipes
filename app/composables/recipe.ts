import type { SelectItem } from '@nuxt/ui';

import type { CookingTime, Difficulty } from '~~/.generated/prisma';

export function useCookingTimeOptions() {
  return [
    {
      value: 'SHORT',
      label: '5-10 minutes',
    },
    {
      value: 'MEDIUM',
      label: '10-30 minutes',
    },
    {
      value: 'LONG',
      label: '30-60 minutes',
    },
    {
      value: 'VERY_LONG',
      label: '60+ minutes',
    },
  ] satisfies (SelectItem & { value: CookingTime })[];
}

export function useDifficultyOptions() {
  return [
    {
      value: 'EASY',
      label: 'Easy',
    },
    {
      value: 'MEDIUM',
      label: 'Medium',
    },
    {
      value: 'HARD',
      label: 'Hard',
    },
  ] satisfies (SelectItem & { value: Difficulty })[];
}
