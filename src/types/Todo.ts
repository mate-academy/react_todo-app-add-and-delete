export interface Todo {
  id: number;
  createdAt?: string;
  userId: number;
  title: string;
  updatedAt?: string;
  completed: boolean;
}
