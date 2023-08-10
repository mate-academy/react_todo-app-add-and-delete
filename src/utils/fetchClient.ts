const BASE_URL = 'https://mate.academy/students-api';

// returns a promise resolved after a given delay
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// To have autocompletion and avoid mistypes
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type Data = {
  title: string,
  completed: boolean,
  userId: number,
} | null;

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: Data = null, // we can send any data to the server
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    // We add body and Content-Type only for the requests with data
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  // we wait for testing purpose to see loaders
  return wait(300)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status.toString()}, ${response.text}`);
      }

      return response.json();
    });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: Data) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: Data) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request(url, 'DELETE'),
};
