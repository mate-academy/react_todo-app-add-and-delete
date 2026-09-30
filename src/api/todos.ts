import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

//https://mate.academy/students-api/todos?userId=4469

export const USER_ID = 4469;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const postTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
