import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3638;

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const updateTodo = (todo: Todo): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    title: todo.title,
    completed: todo.completed,
  });
};

export const deleteTodo = (todoId: number): Promise<void> => {
  return client.delete(`/todos/${todoId}`) as Promise<void>;
};
