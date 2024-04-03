const API_URL = 'https://mate.academy/students-api';

function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

export const getTodos = <T>(url: string): Promise<T> => {
  return wait(100)
    .then(() => fetch(API_URL + url, { method: 'GET' }))
    .then(response => response.json());
};

export const deleteTodo = <T>(url: string): Promise<T> => {
  return wait(100)
    .then(() => fetch(API_URL + url, { method: 'DELETE' }))
    .then(response => response.json());
};

export const addTodo = <T>(url: string, data: any): Promise<T> => {
  return wait(100)
    .then(() =>
      fetch(API_URL + url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }),
    )
    .then(response => response.json());
};
