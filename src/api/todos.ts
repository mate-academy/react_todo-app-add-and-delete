import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1441;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodos = ({ id, title, userId, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, userId, completed });
};

export const getActive = () => {
  return getTodos().then(todos => todos.filter(item => !item.completed));
};

export const getCompleted = () => {
  return getTodos().then(todos => todos.filter(item => item.completed));
};

export const getClearCompleted = () => {
  return getTodos().then(todos =>
    todos.filter(item => item.completed).map(item => deleteTodos(item.id)),
  );
};
