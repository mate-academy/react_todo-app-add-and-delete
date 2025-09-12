import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 0;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number): Promise<void> => {
  return client.delete(`/todos/${id}`).then(() => {});
};

export const updateTodo = (todo: Todo): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
