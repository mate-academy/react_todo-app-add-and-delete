import { RequestMethod } from '../types/RequestMethod';

/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'https://mate.academy/students-api';

function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function request<T>(
  url: string,
  method: RequestMethod,
  data: any = null,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return Promise.all([
    fetch(BASE_URL + url, options),
    wait(300),
  ])
    .then(([response]) => (response.ok
      ? response.json()
      : Promise.reject()
    ));
}

export const client = {
  get: <T>(url: string) => request<T>(url, RequestMethod.Get),
  post: <T>(url: string, data: any) => request<T>(
    url, RequestMethod.Post, data,
  ),
  patch: <T>(url: string, data: any) => request<T>(
    url, RequestMethod.Patch, data,
  ),
  delete: (url: string) => request(url, RequestMethod.Delete),
};
