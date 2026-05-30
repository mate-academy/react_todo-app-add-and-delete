import { Todo } from '../types/Todo';

const BASE_URL = 'https://mate.academy/students-api';

function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  return fetch(BASE_URL + url, {
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    ...options,
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  });
}

export const getTodos = (userId: number): Promise<Todo[]> =>
  request(`/todos?userId=${userId}`);

export const addTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> =>
  request('/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  });

export const deleteTodo = (id: number): Promise<void> =>
  request(`/todos/${id}`, { method: 'DELETE' });
