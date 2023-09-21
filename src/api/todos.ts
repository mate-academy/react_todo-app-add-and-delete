import { TodoType } from '../types/TodoType';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const createTodo = ({
  userId,
  title,
  completed,
}: Omit<TodoType, 'id'>) => {
  return client.post<TodoType>('/todos', { userId, title, completed });
};
