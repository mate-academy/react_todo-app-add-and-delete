export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

export interface TodoData {
  title: string;
  userId: number;
  completed: boolean;
}

export enum EnumTodoFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}
