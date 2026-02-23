import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4006;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}/?userId=${USER_ID}`);
};

// Add more methods here
