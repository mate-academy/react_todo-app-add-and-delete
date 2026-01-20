import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3845;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({
  title,
  completed,
}: {
  title: string;
  completed: boolean;
}) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed,
  });
};
