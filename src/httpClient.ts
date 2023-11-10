import { RequestMethods } from './enums/RequestMethods';

const BASE_URL = 'https://mate.academy/students-api';

function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function request<T>(
  url: string,
  method: RequestMethods = RequestMethods.Get,
  data: any = null,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return wait(100)
    .then(() => fetch(BASE_URL + url, options))
    .catch(error => {
      throw new Error(error.message);
    })
    .then(response => {
      return response.json();
    });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(
    url,
    RequestMethods.Post,
    data,
  ),
  patch: <T>(url: string, data: any) => request<T>(
    url,
    RequestMethods.Patch,
    data,
  ),
  delete: (url: string) => request(
    url,
    RequestMethods.Delete,
  ),
};
