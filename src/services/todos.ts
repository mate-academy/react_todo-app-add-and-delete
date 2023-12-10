import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export function getTodos(userId: number) {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
}

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos?userId=${userId}`);
};
