import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1120;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, {
    title,
    userId,
    completed,
  });
};

export const changeTodo = (todo: Todo, todoId: number) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};
