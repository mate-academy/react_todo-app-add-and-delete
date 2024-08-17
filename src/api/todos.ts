import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1201;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, {
    userId,
    title,
    completed,
  });
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const updateTodoTitle = (todoId: number, newTitle: string) => {
  return client.patch(`/todos/${todoId}`, {
    title: newTitle,
  });
};

export const updateTodoStatus = (todoId: number, newStatus: boolean) => {
  return client.patch(`/todos/${todoId}`, {
    completed: newStatus,
  });
};
