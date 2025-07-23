import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const USER_ID = 3257;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoToServer = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    title: title.trim(),
    userId,
    completed: false,
  });
};

export const deleteTodoFromServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoStatus = (todoId: number, newStatus: boolean) => {
  return client.patch(`/todos/${todoId}`, {
    completed: newStatus,
  });
};
