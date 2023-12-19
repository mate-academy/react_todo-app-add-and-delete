export interface NoIdTodo {
  userId: number;
  title: string;
  completed: boolean;
}

export interface Todo extends NoIdTodo {
  id: number;
}
