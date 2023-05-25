import { Todo } from '../types/Todo';
import { TodoData } from '../types/TodoData';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (data: TodoData) => {
  return client.post('/todos', data);
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};
