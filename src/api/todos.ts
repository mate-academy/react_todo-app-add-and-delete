import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: Todo) => {
  return client.post('/todos', newTodo);
};

export const onDelete = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const onUpdate = (todoId: number, data: Todo) => {
  return client.patch(`/todos/${todoId}`, data);
};
