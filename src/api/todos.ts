import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3840;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodoApi = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodoApi = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
// Add more methods here
