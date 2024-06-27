export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface NewTodos {
  title: string;
  completed: boolean;
  userId: number;
}

export enum Filter {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}
