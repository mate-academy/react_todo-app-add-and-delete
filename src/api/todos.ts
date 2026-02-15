import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3968;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const postTodos = ({
  title,
  userId,
}: Omit<Todo, 'id' | 'completed'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed: false });
};

export const patchTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete<void>(`/todos/${id}`);
};
