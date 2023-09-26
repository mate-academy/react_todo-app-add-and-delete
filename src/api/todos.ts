import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function postTodo(todo: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', todo);
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}
