import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';

export const USER_ID = 3476;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}
// Add more methods here
