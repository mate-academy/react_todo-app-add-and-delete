import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/constants';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = ({ title }: { title: string }) => {
  return client.post<Todo>(
    '/todos',
    { title, userId: USER_ID, completed: false },
  );
};
