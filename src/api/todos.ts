import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1305;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const updateTodo = (postId: number, completed: boolean) => {
  return client.patch<Todo[]>(`/todos/${postId}`, { completed });
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
