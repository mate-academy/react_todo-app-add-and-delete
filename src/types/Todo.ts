export interface TodoRequest {
  userId: number;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: number,
  userId: number;
  title: string;
  completed: boolean;
}
