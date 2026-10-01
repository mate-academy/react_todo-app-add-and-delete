const BASE_URL = 'https://mate.academy/students-api';

// returns a promise resolved after a given delay
function wait(delay: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// To have autocompletion and avoid mistypes
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T, D = null>(
  url: string,
  method: RequestMethod = 'GET',
  data: D = null as D,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    // We add body and Content-Type only for the requests with data
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  // DON'T change the delay it is required for tests
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
  get: <T>(url: string): Promise<T> => request<T>(url),

  post: <T, D>(url: string, data: D): Promise<T> =>
    request<T, D>(url, 'POST', data),

  patch: <T, D>(url: string, data: D): Promise<T> =>
    request<T, D>(url, 'PATCH', data),

  delete: <T>(url: string): Promise<T> => request<T>(url, 'DELETE'),
};
