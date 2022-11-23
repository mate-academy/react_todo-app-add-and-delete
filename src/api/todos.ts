import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (newTodo: Partial<Todo>) => {
  return client.post('/todos', newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const getCompletedTodos = (id: number) => {
  return client.get<Todo[]>(`/todos?userId=${id}&completed=true`);
};
