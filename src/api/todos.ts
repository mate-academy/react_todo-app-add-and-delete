import { Todo } from '../types/Todo';
import { Data } from '../types/Data';
import { client } from '../utils/fetchClient';
import { FilterBy } from '../types/FilterBy';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const filterTodos = (todos: Todo[], filter: FilterBy) => {
  const filtredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterBy.All:
        return todo;
      case FilterBy.ACTIVE:
        return !todo.completed;
      case FilterBy.COMPLETED:
        return todo.completed;
      default:
        return [];
    }
  });

  return filtredTodos;
};

export const postTodo = (newTodo: Data) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
