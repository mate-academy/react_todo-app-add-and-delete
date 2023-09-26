import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 11542;

export const getTodos = (userId: number = USER_ID) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({
  id,
  title,
  completed,
  userId,
}: Todo): Promise<Todo> => {
  return client.patch(`/todos/${id}`, { title, completed, userId });
};
