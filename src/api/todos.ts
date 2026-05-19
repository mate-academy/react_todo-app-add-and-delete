import { Todo, TodoAdd } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4089;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  const newTodo: TodoAdd = {
    title,
    completed: false,
    userId: USER_ID,
  };

  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (id: Todo['id']) => {
  return client.delete(`/todos/${id}`);
};
