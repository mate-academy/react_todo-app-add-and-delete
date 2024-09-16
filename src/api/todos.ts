import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1233;
export const url = `./todos?userId=${USER_ID}`;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Todo): Promise<Todo> => {
  return client.post<Todo>('/todos', todo);
};

export function onDelete(id: number) {
  return client.delete(`/todos/${id}`);
}
