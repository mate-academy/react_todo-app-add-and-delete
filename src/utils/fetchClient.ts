const BASE_URL = 'https://mate.academy/students-api';

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body } = options;

  // add 100–200ms delay (tests expect this)
  await wait(150);

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: body
      ? { 'Content-Type': 'application/json; charset=UTF-8' }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // let caller show a friendly message
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  // DELETE may have no body
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'POST', body }),
  patch: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'PATCH', body }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
