import { client } from '../utils/fetchClient';
import { Todo } from './../types/Todo';

export const USER_ID = 628;

export const getTodosFromAPI = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getCompletedTodosFromAPI = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}&completed=true`);
};

export const getTodoFromAPI = (id: number) => {
  return client.get<Todo[]>(`/todos?id=${id}`);
};
