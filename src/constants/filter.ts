export const FILTERS = {
  all: 'all',
  completed: 'completed',
  active: 'active',
} as const;

export type FilterType = (typeof FILTERS)[keyof typeof FILTERS];
