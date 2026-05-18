import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4105;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({
  title,
  completed,
  userId,
}: {
  title: string;
  completed: boolean;
  userId: number;
}) => {
  return client.post<Todo>('/todos', {
    title,
    completed,
    userId,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) => {
  return client.patch<Todo>(`/todos/${id}`, {
    completed,
  });
};
