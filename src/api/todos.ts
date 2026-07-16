import { Todo } from '../types/Todo';

export const USER_ID = 4345; // TODO: replace with your userId

const BASE_URL = 'https://mate.academy/students-api';

function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function request<T>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  data: unknown = null,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return wait(300)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
}

export const getTodos = () => {
  return request<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return request<Todo>('/todos', 'POST', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return request(`/todos/${id}`, 'DELETE');
};
