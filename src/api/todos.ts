import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 467;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (todoTitle: Todo['title']) => {
  return client.post('/todos', {
    title: todoTitle,
    userId: USER_ID,
    completed: false,
  });
};
