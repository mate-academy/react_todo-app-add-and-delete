import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2496;

export const getTodos = (completed?: boolean) => {
  return client.get<Todo[]>(
    `/todos?userId=${USER_ID}${completed !== undefined ? `&completed=${completed}` : ''}`,
  );
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = ({ title, userId, completed }: Todo) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId,
    completed,
  });
};

export const updateTodo = ({ completed, id, title }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    completed,
    title,
  });
};

// "title": "Learn JS",
//   "userId": 4,
//   "completed": false
