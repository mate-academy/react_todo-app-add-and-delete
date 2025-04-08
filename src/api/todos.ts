import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2504;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Partial<Todo>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
