import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2969;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const editTodo = (id: number, postData: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, postData);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const postTodo = (newTodo: {
  title: string;
  userId: number;
  completed: boolean;
}) => {
  return client.post<Todo>(`/todos`, newTodo);
};

// Add more methods here
