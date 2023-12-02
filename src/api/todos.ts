import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const newPost = async (userId: number, title: string): Promise<Todo> => {
  // Send a POST request using client.post
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed: false,
  });
};
