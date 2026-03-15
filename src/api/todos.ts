import { Todo } from '../types';

const BASE_URL = 'https://mate.academy/students-api';
const WAIT_DELAY = 500;

type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

async function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: unknown,
): Promise<T> {
  await wait(WAIT_DELAY);

  const options: RequestInit = { method };

  if (data !== undefined) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=utf-8',
    };
  }

  const response = await fetch(`${BASE_URL}${url}`, options);

  if (!response.ok) {
    throw new Error('Request failed');
  }

  return response.json();
}

export const getTodos = (userId: number) =>
  request<Todo[]>(`/todos?userId=${userId}`);

export const createTodo = (todo: Omit<Todo, 'id'>) =>
  request<Todo>('/todos', 'POST', todo);

export const deleteTodo = (todoId: number) =>
  request(`/todos/${todoId}`, 'DELETE');

export const updateTodo = (todoId: number, data: Partial<Omit<Todo, 'id'>>) =>
  request<Todo>(`/todos/${todoId}`, 'PATCH', data);
