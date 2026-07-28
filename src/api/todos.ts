import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4401;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  return client.post<Todo>('/todos', { title, userId: USER_ID, completed: false });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, completed, title }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {completed, title});
}
// Add more methods here
