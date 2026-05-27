import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4202;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const postTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

// Add more methods here
// Додати сюди більше методів
