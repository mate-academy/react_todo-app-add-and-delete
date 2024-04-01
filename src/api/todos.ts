import { Todo } from '../types/Types';
import { client } from '../utils/fetchClient';

export const USER_ID = 398;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ userId, title, completed }: Todo) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const setCompletedTodo = ({ id, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};
// Add more methods here
