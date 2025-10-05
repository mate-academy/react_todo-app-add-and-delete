import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3504;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const toggleTodoCompleted = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    completed: !todo.completed,
  });
};
