import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

export const USER_ID = 630;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: Todo) => {
  return client.post(`/todos?userId=${USER_ID}/todo`, data);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos?userId=${USER_ID}/todo/${todoId}`);
};
