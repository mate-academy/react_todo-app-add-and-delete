import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4195;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// -------- Add
export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

// -------- Update
export const updateTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
