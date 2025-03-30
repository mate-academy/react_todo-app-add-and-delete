import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2500;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const createTodo = ({
  userId,
  title,
  completed = false,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};
