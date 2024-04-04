import { Todo } from '../types/Todo';

const API_URL = 'https://mate.academy/students-api';

enum Request {
  GET = 'GET',
  DELETE = 'DELETE',
  POST = 'POST',
}

function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

const request = <T>(
  url: string,
  method: Request,
  data?: Omit<Todo, 'id'>,
): Promise<T> => {
  const option: RequestInit = { method };

  if (data) {
    option.body = JSON.stringify(data);
    option.headers = {
      'Content-Type': 'application/json; charset=utf-8',
    };
  }

  return wait(100)
    .then(() => fetch(API_URL + url, option))
    .then(response => response.json());
};

export const client = {
  get: <T>(url: string): Promise<T> => request(url, Request.GET),
  delete: (url: string): Promise<void> => request(url, Request.DELETE),
  post: <T>(url: string, data: Omit<Todo, 'id'>): Promise<T> =>
    request<T>(url, Request.POST, data),
};
