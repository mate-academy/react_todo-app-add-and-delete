export interface Todo {
  id: number;
  userId: number | null;
  title: string | undefined;
  completed: boolean;
}
