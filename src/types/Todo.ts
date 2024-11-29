export interface Todo {
  deleting: 'idle' | 'deleting' | 'deleted';
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
