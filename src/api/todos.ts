import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2551;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function addTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>(`/todos`, { title, userId, completed });
}

export function updateTodo({ id, ...todoData }: Todo) {
  return client.patch<Todo>(`/todos/${id}`, todoData);
}
