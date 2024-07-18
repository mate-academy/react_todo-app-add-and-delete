import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 9925;

const myUrl = `/todos?userId=${USER_ID}`;

export const getTodos = () => {
  return client.get<Todo[]>(myUrl);
};

export const postTodo = (title: string) => {
  return client.post<Todo>(myUrl, {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
