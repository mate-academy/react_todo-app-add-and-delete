import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const user = localStorage.getItem('user');

export const USER_ID = user ? JSON.parse(user).id : 4291;

export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);

export const createTodo = (title: string) =>
  client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });

export const deleteTodo = (id: number) => client.delete(`/todos/${id}`);
