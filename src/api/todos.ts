import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/User_Id';
import { client } from '../utils/fetchClient';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (id: number | number[]) => {
  return client.delete(`/todos/${id}`);
};

export const createTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', {
    userId: todo.userId,
    title: todo.title,
    completed: todo.completed,
  });
};

// Add more methods here
