import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 467;

const BASE_TODOS_PATH = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(`${BASE_TODOS_PATH}?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`${BASE_TODOS_PATH}/${todoId}`);
};

export const addTodo = (todoTitle: Todo['title']) => {
  return client.post(BASE_TODOS_PATH, {
    title: todoTitle,
    userId: USER_ID,
    completed: false,
  });
};
