const BASE_URL = 'https://mate.academy';

const wait = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error();
  }

  if (response.status === 204) {
    await wait(100);

    return undefined as T;
  }

  const data = await response.json();

  await wait(100);

  return data;
};

export const client = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, data: unknown) =>
    request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: <T>(url: string) =>
    request<T>(url, {
      method: 'DELETE',
    }),
};
