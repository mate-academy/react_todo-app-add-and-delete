import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 534;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};
