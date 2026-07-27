import { NewTodo, Todo, TodoId } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4369;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodo = (newTodo: NewTodo) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (todoId: TodoId) => {
  return client.delete(`/todos/${todoId}
    `);
};

export const changeTodo = (newTodo: Todo) => {
  return client.patch(`/todos/${newTodo.id}`, newTodo);
};
