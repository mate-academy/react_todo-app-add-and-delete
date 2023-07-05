import { CreateTodo } from '../types/CreateTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

const createTodo = (args: CreateTodo) => {
  return client.post<Todo>('/todos', args);
};

const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const todosApi = {
  getTodos,
  createTodo,
  deleteTodo,
};
