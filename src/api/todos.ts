import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3044;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function addTodo({
  title,
  completed = false,
  userId = USER_ID,
}: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, completed, userId });
}

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}
