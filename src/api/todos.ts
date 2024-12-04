import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1913;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos/`, { title, userId, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
