import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';
import { CreateTodo } from '../types/CreateTodo';
import { USER_ID } from '../types/constants';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title }:CreateTodo) => client
  .post<Todo>('/todos',
  {
    title,
    userId: USER_ID,
    completed: false,
  });

export const deleteTodo = (todoId: number) => client
  .delete(`/todos/${todoId}`);

export const updateTodo = (todoId: number, todo: Todo) => client
  .patch<Todo>(`/todos/${todoId}`, todo);
