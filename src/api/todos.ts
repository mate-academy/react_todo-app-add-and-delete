import { USER_ID } from '../constans';
import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);

export const creatTodo = ({ userId, completed, title }: Omit<Todo, 'id'>) =>
  client.post<Todo>(`/todos`, {
    userId,
    completed,
    title,
  });

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
