import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2548;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const createTodo = ({ title, completed, userId }: Todo) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, title, userId, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, userId, completed });
};
