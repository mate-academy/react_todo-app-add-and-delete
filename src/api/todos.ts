import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 418;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here

export const getVisibleTodos = (todos: Todo[], status: Status) => {
  switch (status) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);

    case Status.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
