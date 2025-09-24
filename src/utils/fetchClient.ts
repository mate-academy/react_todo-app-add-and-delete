const BASE_URL = 'https://mate.academy/students-api';

function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<TResponse, TBody = undefined>(
  url: string,
  method: RequestMethod = 'GET',
  data?: TBody,
): Promise<TResponse> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return wait(100)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
}

export const client = {
  get: <TResponse>(url: string) => request<TResponse>(url),
  post: <TResponse, TBody>(url: string, data: TBody) =>
    request<TResponse, TBody>(url, 'POST', data),
  patch: <TResponse, TBody>(url: string, data: TBody) =>
    request<TResponse, TBody>(url, 'PATCH', data),
  delete: <TResponse>(url: string) => request<TResponse>(url, 'DELETE'),
};
