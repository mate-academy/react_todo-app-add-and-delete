import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}

export function createTodo(preparedTodo: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', preparedTodo);
}
// Add more methods here
