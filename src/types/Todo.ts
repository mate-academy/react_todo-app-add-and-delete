export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CreateTodoArgs {
  userId: number;
  title: string;
  completed: boolean;
}
