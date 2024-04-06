export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export interface State {
  todos: Todo[];
  filterBy: Filter;
  errorMessage: string;
  tempTodo: Todo | null;
  isLoading: boolean;
  currentTodosId: number[];
}
