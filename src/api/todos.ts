import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client
    .get<Todo[]>(`/todos?userId=${userId}`)
    .catch(() => {
      throw new Error();
    });
};

export const addTodo = (userId: number, todo: Omit<Todo, 'id'>) => {
  return client
    .post<Todo>(`/todos?userId=${userId}`, todo)
    .catch(() => {
      throw new Error();
    });
};

export const deleteTodo = (todoId: number) => {
  return client
    .delete(`/todos/${todoId}`)
    .catch(() => {
      throw new Error();
    });
};
