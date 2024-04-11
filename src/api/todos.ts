import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 342;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const sendTodoToServer = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodoFromServer = (id: number) => {
  return client.delete(`/todos/${id}`);
};
