export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterTodo {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}
