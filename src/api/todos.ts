import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 883;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = async (id: number) => {
  const response = await client.delete(`/todos/${id}`);

  return response as Response;
};

export const postTodos = async (
  title: string,
  userId: number,
): Promise<Todo> => {
  const response = await client.post<Todo>('/todos', {
    title: title,
    userId: userId,
    completed: false,
  });

  return response;
};

// Add more methods here
