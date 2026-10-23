import { Todo } from '../types/Todo';

export const USER_ID = 12345; // ваш userId

const BASE_URL = 'https://mate.academy/students-api';

function wait(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  await wait(100);

  const response = await fetch(BASE_URL + url, options);

  if (!response.ok) {
    throw new Error();
  }

  return response.json();
}

export const getTodos = () => {
  return request<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return request<Todo>('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ userId: USER_ID, title, completed: false }),
  });
};

export const deleteTodo = (todoId: number) => {
  return request(`/todos/${todoId}`, { method: 'DELETE' });
};
