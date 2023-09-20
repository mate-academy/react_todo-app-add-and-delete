import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Todo) => {
  return client.post('/todos', todo);
};

export const editTodo = (todo: Todo) => {
  return client.patch(`/todos/${todo.id}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.get<Todo[]>(`/todos/${todoId}`);
};
