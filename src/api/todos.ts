import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export function filterTodos(todos: Todo[], filter: Status) {
  switch (filter) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);
    case Status.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}

export const USER_ID = 142;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todoTitle: string) => {
  return client.post<Todo>('/todos', {
    title: todoTitle,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
// Add more methods here
