import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3778;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = ({
  userId = USER_ID,
  title,
  completed = false,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, {
    userId,
    title,
    completed,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
