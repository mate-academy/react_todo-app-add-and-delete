export const FILTER = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export type Filter = (typeof FILTER)[keyof typeof FILTER];
