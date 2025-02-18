export const FILTERS = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
} as const;

export type FilterType = (typeof FILTERS)[keyof typeof FILTERS];
