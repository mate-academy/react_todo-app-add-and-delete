export const FILTER = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export type FilterStatus = (typeof FILTER)[keyof typeof FILTER];
