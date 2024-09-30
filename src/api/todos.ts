import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1314;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (itemId: number) => {
  return client.delete(`/todos/${itemId}`);
};

export const postTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};

export const updeteTodo = (data: Todo) => {
  return client.patch<Todo>(`/todos/${data.id}`, data);
};
// Add more methods here
