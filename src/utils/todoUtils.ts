import { IsValidData } from '../components/ErrorInfo/ErrorInfo';
import { Todo } from '../types/Todo';

export enum FilterForTodo {
  ALL,
  ACTIVE,
  COMPLETED,
}

export const visibleTodos = (todos: Todo[], filterTodo: FilterForTodo) => {
  return todos.filter(todo => {
    switch (filterTodo) {
      case FilterForTodo.ALL:
        return todo;

      case FilterForTodo.ACTIVE:
        return todo.completed === false;

      case FilterForTodo.COMPLETED:
        return todo.completed === true;

      default:
        throw new Error(`Wrong filter, ${filterTodo} is not defined`);
    }
  });
};

export const updateIsValidData = (
  prevData: IsValidData,
  field: keyof IsValidData,
  value: boolean,
): IsValidData => {
  return {
    ...prevData,
    [field]: value,
  };
};

export const getCompletedTodosIds = (todos: Todo[]) => {
  return todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);
};
