export const Filters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
} as const;

export type Filter = (typeof Filters)[keyof typeof Filters];
