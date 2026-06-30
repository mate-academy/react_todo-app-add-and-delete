const BASE_URL = 'https://mate.academy/students-api';

type MaybeJSON = unknown;

async function parseResponse(res: Response) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (data && (data as Record<string, unknown>).message) ||
      res.statusText ||
      'Request failed';

    throw new Error(message);
  }

  return data as MaybeJSON;
}

export const client = {
  request: async (url: string, options?: RequestInit) => {
    const res = await fetch(`${BASE_URL}${url}`, options);

    return parseResponse(res);
  },

  get: async <T = unknown>(url: string): Promise<T> => {
    return client.request(url) as Promise<T>;
  },

  post: async <T = unknown>(url: string, body?: unknown): Promise<T> => {
    return client.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }) as Promise<T>;
  },

  delete: async <T = unknown>(url: string): Promise<T> => {
    return client.request(url, { method: 'DELETE' }) as Promise<T>;
  },
};
