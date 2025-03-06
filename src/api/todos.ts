import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2399;

//Load Todos
export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
//Add New Todo
export const createTodo = (newTodo: string) => {
  const addTodo = { userId: USER_ID, completed: false, title: newTodo };

  return client.post<Todo>(`/todos`, addTodo);
};

//Update Todo
export const updateTodoStatus = (updateTodo: Todo) => {
  const tempTodo = { completed: !updateTodo.completed };

  return client.patch<Todo>(`/todos/${updateTodo.id}`, tempTodo);
};

//Delete Todo
export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
