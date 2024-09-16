import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1376;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (todoId: Pick<Todo, 'id'> | number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
