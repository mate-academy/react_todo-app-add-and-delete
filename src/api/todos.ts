import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 11337;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>(
    '/todos',
    { userId: USER_ID, title, completed: false },
  );
};

export const delTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
