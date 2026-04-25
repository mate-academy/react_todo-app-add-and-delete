import { Todo } from '../types/Todo';

const BASE_URL = 'https://mate.academy/students-api';

type RequestMethod = 'GET' | 'POST' | 'DELETE';

function request<T>(
  path: string,
  method: RequestMethod,
  body?: unknown,
): Promise<T> {
  let headers: HeadersInit | undefined;

  if (body) {
    headers = {
      'Content-Type': 'application/json; charset=utf-8',
    };
  }

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  return fetch(`${BASE_URL}${path}`, options).then(async response => {
    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response.json() as Promise<T>;
  });
}

export function getTodos(userId: number) {
  return request<Todo[]>(`/todos?userId=${userId}`, 'GET');
}

export function createTodo(todo: Omit<Todo, 'id'>) {
  return request<Todo>('/todos', 'POST', todo);
}

export function deleteTodo(todoId: number) {
  return request<Todo>(`/todos/${todoId}`, 'DELETE');
}
