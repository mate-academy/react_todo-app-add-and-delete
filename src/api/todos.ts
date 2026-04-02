import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 12345;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
interface CreateTodoData {
  title: string;
  userId: number;
  completed: boolean;
}

export const createTodo = (data: CreateTodoData) => {
  return client.post<Todo>('/todos', data);
};

export const removeTodoApi = (todoId: number) =>
  client.delete(`/todos/${todoId}`);

export const updateTodoApi = (todoId: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
