export type LoadingTodo = {
  id: number;
  action: 'adding' | 'removing' | 'updating';
} | null;
