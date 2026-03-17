export const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
} as const;

export type FilterType = (typeof FILTERS)[keyof typeof FILTERS];
