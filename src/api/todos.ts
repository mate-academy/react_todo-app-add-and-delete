import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4515;

type NewTodo = {
  userId: number;
  title: string;
  completed: boolean;
};

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string): Promise<Todo> => {
  return client.post<Todo, NewTodo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number): Promise<Todo> => {
  return client.delete<Todo>(`/todos/${todoId}`);
};
