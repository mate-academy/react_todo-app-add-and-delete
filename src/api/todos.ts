import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 11121;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title, userId, completed }: Todo) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
