export const filterParams = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
} as const;

export type TypeFilterParams = (typeof filterParams)[keyof typeof filterParams];
