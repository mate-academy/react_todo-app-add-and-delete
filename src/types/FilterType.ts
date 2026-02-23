export const Filter = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
} as const;

export type FilterType = (typeof Filter)[keyof typeof Filter];
