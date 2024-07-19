import { OptionaAtributs } from '../types/OptionaAtributs';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 12004;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const postTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: OptionaAtributs<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
