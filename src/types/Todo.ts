export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoServerData = Omit<Todo, 'id'>;

export type TempTodo = Omit<Todo, 'userId' | 'completed'>;
