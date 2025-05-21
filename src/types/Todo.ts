export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoData = Pick<Todo, 'userId' | 'title' | 'completed'>;
