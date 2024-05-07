import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 509;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (title: string) => {
  const newTodo: Omit<Todo, 'id'> = {
    title: title,
    userId: USER_ID,
    completed: false,
  };

  return client.post<Todo>(`/todos`, newTodo);
};

export const updateTodo = ({ id, title, completed, userId }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed, userId });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
