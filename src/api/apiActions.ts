import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const apiActions = {
  get: (userId: number) => {
    return client.get<Todo[]>(`/todos?userId=${userId}`);
  },
  delete: (todoId: number) => {
    return client.delete(`/todos/${todoId}`);
  },
  add: (todo: Omit<Todo, 'id'>) => {
    return client.post<Todo>('/todos', todo);
  },
};
