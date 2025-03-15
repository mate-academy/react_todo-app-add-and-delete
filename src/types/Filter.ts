export const FILTER = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

export type Filter = (typeof FILTER)[keyof typeof FILTER];
