import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2633;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const createTodo = (newTodo: string) => {
  const todo = { userId: USER_ID, title: newTodo, completed: false };

  return client.post<Todo>('/todos', todo);
};

export const statusCompletedUpdate = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const titleUpdate = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
