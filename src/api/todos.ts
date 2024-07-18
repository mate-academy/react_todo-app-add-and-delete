import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 962;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getFilteredTodos = (filter: Filter) => {
  switch (filter) {
    case 'all':
      return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
    case 'active':
      return client.get<Todo[]>(`/todos?userId=${USER_ID}&completed=false`);
    case 'completed':
      return client.get<Todo[]>(`/todos?userId=${USER_ID}&completed=true`);
    default:
      return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
  }
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, todo: Todo) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};

export const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};
