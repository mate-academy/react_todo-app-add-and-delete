import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4400;

const URL = `/todos?userId=${USER_ID}`;

export const getTodos = () => {
  return client.get<Todo[]>(URL);
};

export const postTodo = () => {
  return client.post(URL, {});
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
