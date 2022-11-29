import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { NewTodo } from '../types/NewTodo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: NewTodo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const handleDeleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
