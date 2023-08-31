import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (
  {
    id, title, completed, userId,
  }: Todo,
) => {
  return client.post<Todo>(
    '/todos',
    {
      id,
      title,
      completed,
      userId,
    },
  );
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
