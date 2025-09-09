const BASE_URL = 'https://mate.academy/students-api';

// returns a promise resolved after a given delay
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// To have autocompletion and avoid mistypes
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function request<T, D = unknown>(
  url: string,
  method: RequestMethod = 'GET',
  data?: D,
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
  await wait(100);

  const response = await fetch(BASE_URL + url, options);

  if (!response.ok) {
    throw new Error();
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();

  return text ? JSON.parse(text) : ({} as T);
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T, D>(url: string, data: D) => request<T, D>(url, 'POST', data),
  patch: <T, D>(url: string, data: D) => request<T, D>(url, 'PATCH', data),
  delete: (url: string) => request(url, 'DELETE'),
};
