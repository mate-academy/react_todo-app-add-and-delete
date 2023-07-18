import { Todo } from './types/Todo';

const BASE_URL = 'https://mate.academy/students-api';

export const getTodos = (userId: number, param = '') => {
  return fetch(`${BASE_URL}/todos?userId=${userId}&${param}`)
    .then((data) => data.json())
    .catch((error) => new Error(error.message));
};

export const createTodo = (srt: string, userId: number) => {
  return fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      userId,
      completed: false,
      title: srt,
    }),
  }).catch((error) => error.message);
};

export const deleteTodoOnServer = (id: number) => {
  return fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  }).catch((error) => new Error(error.message));
};

export const updateTodoProp = (id: number, object: Partial<Todo>) => {
  return fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(object),
  }).catch((error) => new Error(error.message));
};

export const getTodosCompletedStatus = (
  f: (arg: Todo[]) => void,
  arg: boolean,
) => {
  return fetch(`${BASE_URL}/todos?completed=${arg}`)
    .then((data) => data.json())
    .then((todoList) => f(todoList))
    .catch((error) => new Error(error.message));
};
