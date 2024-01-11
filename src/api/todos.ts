import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 11482;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({
  id,
  title,
  userId,
  completed,
}: Todo): Promise<Todo> => {
  return client.patch(`/todos/${id}`, {
    title,
    userId,
    completed,
  });
};
