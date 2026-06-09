import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4309;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (id: number): Promise<unknown> => {
  return client.delete(`/todos/${id}`);
};
