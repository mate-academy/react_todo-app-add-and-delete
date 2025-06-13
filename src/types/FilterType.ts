export const FilterType = {
  All: 'All',
  Active: 'Active',
  Completed: 'Completed',
} as const;

export type FilterTypeValues = (typeof FilterType)[keyof typeof FilterType];
