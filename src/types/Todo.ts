export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type NewTodo = Omit<Todo, 'id'>;
// export type TodoId = Pick<Todo, 'id'>;
export type TodoId = Todo['id'];
