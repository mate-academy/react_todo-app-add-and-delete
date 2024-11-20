import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const renameTodo = ({
  id,
  title,
}: Omit<Todo, 'userId' | 'completed'>) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};

export const changeCompletedStatus = ({ id, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};
