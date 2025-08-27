const BASE_URL = 'https://mate.academy/students-api';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const delay = (ms = 150) => new Promise(res => setTimeout(res, ms));

async function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: unknown,
): Promise<T> {
  await delay(150);

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  };

  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${url}`, options);

  if (!response.ok) {
    const text = await response.text().catch(() => '');

    throw new Error(text || `Request failed with ${response.status}`);
  }

  return response.json();
}

export const client = {
  get: <T>(url: string) => request<T>(url, 'GET'),
  post: <T>(url: string, data: unknown) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: unknown) => request<T>(url, 'PATCH', data),
  delete: <T>(url: string) => request<T>(url, 'DELETE'),
};
