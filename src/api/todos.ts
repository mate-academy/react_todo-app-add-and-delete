import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4071;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (title: string): Promise<Todo> =>
  client.post<Todo>('/todos', { title, userId: USER_ID, completed: false });

export const deleteTodo = (id: number): Promise<unknown> =>
  client.delete(`/todos/${id}`);
