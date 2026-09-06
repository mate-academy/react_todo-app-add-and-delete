import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4428;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export function createTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
  return client.post('/todos', { userId, title, completed });
}

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: Partial<Omit<Todo, 'id' | 'userId'>>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
