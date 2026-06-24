import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const updateTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const USER_ID = 4326;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: { title: string }) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title: data.title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
