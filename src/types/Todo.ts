export interface Todo {
  id: number;
  userId?: number;
  title: string;
  completed: boolean;
}

export interface NewTodo {
  title: string,
  userId: number,
  completed: boolean,
}
