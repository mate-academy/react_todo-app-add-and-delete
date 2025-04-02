import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2529;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const toggleTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};
