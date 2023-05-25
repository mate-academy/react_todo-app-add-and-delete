import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, data: Todo | null) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
