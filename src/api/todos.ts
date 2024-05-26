import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 689;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post(`/todos/`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (todo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

// Add more methods here
