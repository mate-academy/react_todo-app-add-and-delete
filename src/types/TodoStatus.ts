export const TODO_STATUS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
} as const;

export type TodoStatus = (typeof TODO_STATUS)[keyof typeof TODO_STATUS];
