import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6350;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export async function addTodo(todo: Todo) {
  try {
    await client.post<Todo>(`/todos?userId=${USER_ID}`, todo);
  } catch (error) {
    throw Error('Unable to add a todo');
  }
}

export async function removeTodo(id: number) {
  try {
    await client.delete(`/todos/${id}?userId=${USER_ID}`);
  } catch (error) {
    throw Error('Unable to delete a todo');
  }
}

export async function updateTodo(todo: Todo) {
  try {
    await client.patch(`/todos/${todo.id}`, todo);
  } catch (error) {
    throw Error('Unable to delete a todo');
  }
}
