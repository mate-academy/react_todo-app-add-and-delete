import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 690;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: Todo) => {
  return client.patch<Todo[]>(`/todos/${id}`, data);
};

// Add more methods here
