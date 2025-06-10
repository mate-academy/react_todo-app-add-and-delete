import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2999;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};


export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', { userId: USER_ID, title, completed: false })
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
// Add more methods here

export const deleteAllCompletedTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}&completed=true`);
};


// console.log('client.get<Todo[]>(`/todos?userId=${USER_ID}&completed=true`)',client.get<Todo[]>(`/todos?userId=${USER_ID}&completed=true`));

