// src/api/todos.ts
import { Todo } from '../types/Todo';
import { client } from './../utils/fetchClient';

export const USER_ID = 4423;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Додаємо створення Todo
export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

// Додаємо видалення Todo
export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
