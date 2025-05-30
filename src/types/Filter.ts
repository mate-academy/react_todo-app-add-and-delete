export const FilterValues = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
} as const;

export type Filter =
  | typeof FilterValues.ALL
  | typeof FilterValues.ACTIVE
  | typeof FilterValues.COMPLETED;
