import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2355;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({
  title,
  completed = false,
  userId = USER_ID,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({
  completed = false,
  id,
}: Omit<Todo, 'userId' | 'title'>) => {
  return client.patch<Todo>(`/todos/${id}`, { completed, id });
};
