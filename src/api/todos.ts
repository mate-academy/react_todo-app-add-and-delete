import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3222;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function createTodo({
  title,
  userId,
  completed = false,
}: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, userId, completed });
}

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}

// Add more methods here
