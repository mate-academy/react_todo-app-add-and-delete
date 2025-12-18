import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3772;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({
  completed,
  title,
  userId = USER_ID,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos/', { completed, title, userId });
};

export const updateTodo = ({ id, completed, title, userId }: Todo) => {
  return client.patch(`/todos/${id}`, { completed, title, userId });
};
// Add more methods here
