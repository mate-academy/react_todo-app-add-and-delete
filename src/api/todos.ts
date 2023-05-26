import { TodoType } from '../types/Todo';
import { client } from '../utils/fetchClient';

type PostBodyData = {
  title: string;
  userId: number;
  completed: boolean;
};

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, data: PostBodyData) => {
  return client.post<TodoType>(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
