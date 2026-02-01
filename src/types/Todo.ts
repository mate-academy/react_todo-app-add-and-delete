export interface Todo {
  id: number;
  clientId?: string;
  userId: number;
  title: string;
  completed: boolean;
}
