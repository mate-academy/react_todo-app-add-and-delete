import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number | undefined, title : string) => {
  const todo = {
    title,
    userId,
    completed: false,
  };

  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id : number) => client.delete(`/todos/${id}`);
