const BASE_URL = 'https://mate.academy/students-api';

function wait(delay:number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function request<T>(
  url:string,
  method:RequestMethod = 'GET',
  data:T | null = null,
):Promise<T> {
  const options:RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  await wait(100);
  const response = await fetch(BASE_URL + url, options);

  if (!response.ok) {
    throw new Error();
  }

  return response.json();
}

export const client = {
  get: <T>(url:string) => request<T>(url),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: <T>(url:string, data:any) => request<T>(url, 'POST', data),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: <T>(url:string, data:any) => request<T>(url, 'PATCH', data),
  delete: (url:string) => request(url, 'DELETE'),
};
