import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const getTempTodo = (id: number) => {
  return client.get<Todo>(`/todos/${id}`);
};

export const addTodos = ({
  title,
  userId,
  completed,
} :Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed,
  });
};

export const updateTodos = ({ id } :Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { id });
};

export const deleteTodos = (id : number) => {
  return client.delete(`/todos/${id}`);
};
