import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 11625;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newPost: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newPost);
};

export const delTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
