import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2638;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateCompleted = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
