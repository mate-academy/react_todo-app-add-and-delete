import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 338;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${USER_ID}`);
};
