import type { Todo } from '../types/Todo';
import { client, BASE_URL } from '../utils/fetchClient';

export const USER_ID = 4571;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    body: JSON.stringify({
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  }).then(response => {
    if (!response.ok) {
      throw new Error('Unable to add a todo');
    }

    return response.json() as Promise<Todo>;
  });
};

export const deleteTodo = (id: number) => {
  return fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Unable to delete a todo');
    }
  });
};
