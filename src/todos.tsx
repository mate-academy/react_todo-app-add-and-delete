import { Todo } from './Types';
import { client } from './utils/client';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};
