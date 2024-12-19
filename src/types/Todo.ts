export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoResponse extends Todo {
  updatedAt: string;
  createdAt: string;
}
