import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 2338;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title: title.trim(),
    completed: false,
  });
};

export const deleteTodo = (id: number): Promise<void> => {
  return client.delete(`/todos/${id}`);
};
