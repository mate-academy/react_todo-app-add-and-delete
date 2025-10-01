export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  deleting?: boolean;
}
