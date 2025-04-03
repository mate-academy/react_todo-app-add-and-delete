import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2526;

export const todosService = {
  getAll: () => {
    return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
  },
  add: (todo: Todo) => {
    return client.post<Todo>(`/todos`, todo);
  },
  remove: (todo: Todo) => {
    return client.delete(`/todos/${todo.id}`);
  },
  update: (todo: Todo) => {
    return client.patch<Todo>(`/todos/${todo.id}`, todo);
  },
};
