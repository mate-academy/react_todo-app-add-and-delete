import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1685;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Функція для додавання нового todo
export const addTodo = (data: Partial<Todo>) => {
  return client.post<Todo>('/todos', data);
};

// Функція для видалення todo
export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
