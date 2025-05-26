import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
//Your userId is
// 2956
// Please use it for all your requests to the Students API. For example:
// https://mate.academy/students-api/todos?userId=2956
// https://mate.academy/students-api/todos?userId=2952

export const USER_ID = 2952;

// функція відповідає за отримання списку справ з API.
export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
// Create a new todo
// export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
//   return client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo);
// };

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { ...newTodo, userId: USER_ID });
};

// Add more methods here (наприклад, для оновлення та видалення)
// Функція для оновлення існуючого
export const updateTodo = (id: string, updatedTodo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, updatedTodo);
};

// Функція для видалення справи
export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
