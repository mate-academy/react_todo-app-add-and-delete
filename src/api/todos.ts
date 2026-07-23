import { NewTodo, Todo, TodoId } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4369;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodo = (newTodo: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo);
};

export const deleteTodo = (todoId: TodoId) => {
  return client.delete(`/todos/${todoId}?userId=${USER_ID}`);
};

export const changeTodo = (newTodo: Todo) => {
  return client.patch(`/todos/${newTodo.id}?userId=${USER_ID}`, newTodo);
};
