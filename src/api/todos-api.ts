import { NewTodo } from '../types/NewTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const getByUser = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

const create = (todo: NewTodo) => {
  return client.post<Todo>('/todos', todo);
};

const remove = (id: number) => {
  return client.delete(`/todos/${id}`);
};

const removeCompleted = (ids: number[]) => {
  return Promise.all(ids.map(id => client.delete(`/todos/${id}`)));
};

export const todosApi = {
  getByUser,
  create,
  remove,
  removeCompleted,
};
