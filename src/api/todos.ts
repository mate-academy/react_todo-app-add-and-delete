import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4130;

const BASE_URL = '/todos?userId=';

export const getTodos = () => {
  return client.get<Todo[]>(`${BASE_URL}${USER_ID}`);
};

export const postTodos = (data: Todo) => {
  return client.post<Todo[]>(`${BASE_URL}${USER_ID}`, data);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${USER_ID}`);
};
