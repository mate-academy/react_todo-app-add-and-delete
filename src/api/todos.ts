import { Post } from '../types/Post';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 957;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodos = ({ userId, title, completed }: Omit<Post, 'id'>) => {
  return client.post<Post>('/todos', { userId, title, completed });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
