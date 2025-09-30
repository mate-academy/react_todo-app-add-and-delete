export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
export interface AddTodo {
  userId: number;
  title: string;
  completed: boolean;
}
