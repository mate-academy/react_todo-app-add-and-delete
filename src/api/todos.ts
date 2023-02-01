import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`)
    .then(Boolean);
};

export const postTodos = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo >('/todos', data);
};

export const patchTodos = (todoId: number, newData: Todo) => {
  return client.patch(`todos/${todoId}`, newData);
};
