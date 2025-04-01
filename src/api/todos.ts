import { Todo, TodoInput } from './../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2522;

export const dataTodos = {
  getTodos: () => {
    return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
  },
  createTodos: ({ title, completed, userId }: TodoInput): Promise<Todo> => {
    return client.post<Todo>('/todos', { title, completed, userId });
  },
  deleteTodos: (todoId: number) => {
    return client.delete(`/todos/${todoId}`);
  },
  updateTodos: ({ id, title, completed }: Todo) => {
    return client.patch<Todo>(`/todos/${id}`, { title, completed });
  },
};
