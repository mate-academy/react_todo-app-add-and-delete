import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3273;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addNewTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, {
    userId,
    title,
    completed,
  });
};

export const changeTodoStatus = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const changeTodoTitle = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
