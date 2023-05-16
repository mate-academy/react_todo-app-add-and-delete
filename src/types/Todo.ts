export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface NewTodoData {
  userId: number;
  title: string;
  completed: boolean;
}
