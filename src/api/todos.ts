import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4133;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todoData: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>('/todos', todoData);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
