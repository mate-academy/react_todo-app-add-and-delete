import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2585;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (id: number, title: string, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
