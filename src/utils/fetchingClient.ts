/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'https://mate.academy/students-api';

const wait = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

type RequestType = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const request = <T>(
  url: string,
  method: RequestType = 'GET',
  data: any = null,
): Promise<T> => {
  const params: RequestInit = { method };

  if (data) {
    params.body = JSON.stringify(data);
    params.headers = {
      'Content-type': 'application/json; charset=UTF-8',
    };
  }

  return wait(300)
    .then(() => fetch(BASE_URL + url, params))
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
};

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
  delete: <T>(url: string) => request<T>(url, 'DELETE'),
};
