import { USER_ID } from '../api/todos';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export const emptyTodo: Omit<Todo, 'id'> = {
  completed: false,
  userId: USER_ID,
  title: '',
};
