import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
type Data = {
  title?: string,
  userId?: number,
  completed: boolean,
};

type ObjData = {
  id: number,
  userId: number,
  completed: boolean,
  title: string,
  createdAt: string,
  updatedAt: string,
};

export const postTodos = (userId: number, data: Data): Promise<ObjData> => {
  return client.post(`/todos?userId=${userId}`, data);
};

export const deleteTodos = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};
