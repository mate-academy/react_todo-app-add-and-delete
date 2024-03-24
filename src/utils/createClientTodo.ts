import { USER_ID } from '../api/config';
import { ClientTodo } from '../types';

export function createClientTodo(todo?: Partial<ClientTodo>): ClientTodo {
  return {
    completed: todo?.completed ?? false,
    id: todo?.id ?? 0,
    title: todo?.title ?? '',
    userId: todo?.userId ?? USER_ID,
    loading: todo?.loading ?? false,
  };
}
