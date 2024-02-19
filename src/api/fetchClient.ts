const BASE_URL = 'https://mate.academy/students-api';

export const client = {
  get<T>(url: string): Promise<T> {
    return fetch(`${BASE_URL}${url}`).then((res) => res.json());
  },

  post<T>(url: string, data: any): Promise<T> {
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return fetch(`${BASE_URL}${url}`, options).then((res) => res.json());
  },

  delete<T>(url: string): Promise<T> {
    const options = {
      method: 'DELETE',
    };

    return fetch(`${BASE_URL}${url}`, options).then((res) => res.json());
  },
};
