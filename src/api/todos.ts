import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoData } from '../types/TodoData';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todoData: TodoData): Promise<Todo> => {
  return client.post<Todo>('/todos', todoData);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
