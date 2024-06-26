import { Todo } from '../types/Todo';
import { TodoRequestBody } from '../types/requestBodies';
import { client } from '../utils/fetchClient';

export const USER_ID = 827;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: TodoRequestBody) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
