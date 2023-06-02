import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = async (title: string, userId: number) => {
  const response = await client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });

  return response;
};

export const updateTodo = async (id: number, completed: boolean) => {
  const response = await client.patch(`/todos/${id}`, {
    completed,
  });

  return response;
};

export const deleteTodo = async (id: number) => {
  const response = await client.delete(`/todos/${id}`);

  return response;
};
