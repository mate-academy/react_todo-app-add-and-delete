import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 140;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (newTodoTitle: string) => {
  return client.post<Todo>('/todos', {
    title: newTodoTitle,
    userId: USER_ID,
    completed: false,
  });
};

export const editTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
