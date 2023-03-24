import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { FilterType } from '../types/FilterType';

export const USER_ID = 6677;

export const getFilteredTodos = (
  todosList: Todo[],
  filters: FilterType,
): Todo[] => {
  return todosList.filter(todo => {
    switch (filters) {
      case FilterType.ACTIVE:
        return !todo.completed;

      case FilterType.COMPLETED:
        return todo.completed;

      default:
      case FilterType.ALL:

        return todo;
    }
  });
};

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
