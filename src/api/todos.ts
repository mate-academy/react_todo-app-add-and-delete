import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const createTodo = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId,
  });
};

export const updateTodo = (url: number, completed: any) => {
  return client.patch<Todo>(`/todos/${url}`, completed);
};

export const deleteTodo = (url: number) => {
  return client.delete(`/todos/${url}`);
};

/* return fetch('https://mate.academy/students-api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 4982,
      title,
      completed: false,
    }),
  }).then(response => response.json()); */
