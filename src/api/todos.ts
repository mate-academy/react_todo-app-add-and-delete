import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3981;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
// Add new todo
export const createTodo = (data: { title: string }) => {
  return client.post<Todo>(`/todos`, {
    title: data.title,
    userId: USER_ID,
    completed: false,
  });
};

// Delete todo by id
export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
