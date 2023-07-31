/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'https://mate.academy/students-api';

type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

function wait(delay: number) {
  return new Promise(res => {
    setTimeout(res, delay);
  });
}

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.headers = {
      'Content-type': 'application/json; charset=UTF-8',
    };
    options.body = JSON.stringify(data);
  }

  return wait(300)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error('Something wrong');
      }

      return response.json();
    });
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  delete: <T>(url: string) => request<T>(url, 'DELETE'),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
};
