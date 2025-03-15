export const TODO_STATE = {
  resolved: 'resolved',
  rejected: 'rejected',
  loading: 'loading',
  edited: 'edited',
  idle: 'idle',
} as const;

export type TodoState = (typeof TODO_STATE)[keyof typeof TODO_STATE];
