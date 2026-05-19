export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export type TodoAdd = Omit<Todo, 'id'>;

export const TodoStatusMap = {
  All: 'all',
  Completed: 'completed',
  Active: 'active',
} as const;

export type TodoStatus = (typeof TodoStatusMap)[keyof typeof TodoStatusMap];
