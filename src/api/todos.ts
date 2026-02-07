import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3949;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Partial<Todo> робить всі поля <Todo> необов'язковими
export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};
