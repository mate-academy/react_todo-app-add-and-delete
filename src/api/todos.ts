import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
type NewTodoData = {
  title?: string,
  userId?: number,
  completed: boolean,
};

type FullTodoData = {
  id: number,
  userId: number,
  completed: boolean,
  title: string,
  createdAt: string,
  updatedAt: string,
};

export const postTodo
= (userId: number, data: NewTodoData): Promise<FullTodoData> => {
  return client.post(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};
