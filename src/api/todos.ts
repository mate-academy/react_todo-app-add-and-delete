import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3119;

type AddType = {
  title: string;
  userId: number;
  completed: boolean;
};

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: AddType) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, compl: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed: compl });
};

// Add more methods here
