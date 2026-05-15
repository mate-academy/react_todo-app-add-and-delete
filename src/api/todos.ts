import { Todo } from '../types/Todo';

const BASE_URL = 'https://mate.academy/students-api';

function request<T>(url: string, options?: RequestInit): Promise<T> {
  return fetch(`${BASE_URL}${url}`, options).then(response => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  });
}

export const getTodos = (userId: number) =>
  request<Todo[]>(`/todos?userId=${userId}`);

export const createTodo = (todo: Omit<Todo, 'id'>) =>
  request<Todo>('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });

export const deleteTodo = (id: number) =>
  request<unknown>(`/todos/${id}`, { method: 'DELETE' });
