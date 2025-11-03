import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3626;

const getTodoUrl = (id?: number) => `/todos${id ? `/${id}` : ''}`;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (data: Omit<Todo, 'id'>) =>
  client.post<Todo>(getTodoUrl(), { ...data, userId: USER_ID });

export const patchTodo = (id: number, data: Partial<Todo>) =>
  client.patch<Todo>(getTodoUrl(id), data);

export const deleteTodo = (id: number) => client.delete(getTodoUrl(id));
