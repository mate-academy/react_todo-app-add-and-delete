const BASE_URL = 'https://mate.academy/students-api';

function wait(delay: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, delay);
  });
}

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T, D = undefined>(
  url: string,
  method: RequestMethod = 'GET',
  data?: D,
): Promise<T> {
  const options: RequestInit = { method };

  if (data !== undefined) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return wait(100)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText || 'Request failed');
      }

      return response.json() as Promise<T>;
    });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T, D>(url: string, data: D) => request<T, D>(url, 'POST', data),
  patch: <T, D>(url: string, data: D) => request<T, D>(url, 'PATCH', data),
  delete: (url: string) => request<unknown>(url, 'DELETE'),
};
