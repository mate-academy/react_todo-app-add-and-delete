import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1162;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getTodosByStatus = (completed: boolean) => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}&completed=${completed}`);
};

export const getTodoById = (id: number) => {
  return client.get<Todo>(`/todos/${id}`);
};

export const createTodo = (title: string) => {
  const newTodo: Omit<Todo, 'id'> = {
    userId: USER_ID,
    title,
    completed: false,
  };

  return client.post<Todo>('/todos', newTodo);
};

export const updateTodo = (id: number, updatedTodo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, updatedTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
