export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TempTodo {
  userId: number;
  title: string;
  completed: boolean;
}
