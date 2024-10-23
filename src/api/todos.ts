import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1350;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function createTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
  return client.todo<Todo>('/todos', { title, userId, completed });
}
