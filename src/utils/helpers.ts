import { ErrorAction } from '../types/ErrorAction';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterBy: Filter) => {
  const filteredTodos = todos.filter(todo => {
    switch (filterBy) {
      case Filter.ALL:
        return todo;
      case Filter.ACTIVE:
        return todo.completed === false;
      case Filter.COMPLETED:
        return todo.completed === true;
      default:
        return false;
    }
  });

  return filteredTodos;
};

export const getErrorMessage: (action: ErrorAction) => string = (action) => {
  switch (action) {
    case ErrorAction.EMPTY:
      return 'Title can\'t be empty';
    case ErrorAction.LOAD:
      return 'Unable to load todos';
    case ErrorAction.ADD:
    case ErrorAction.DELETE:
    case ErrorAction.UPDATE:
      return `Unable to ${action} a todo`;
    default:
      return 'An unexpected problem has occurred';
  }
};

export const createTempTodo = (title: string) => {
  const todo: Todo = {
    id: 0,
    userId: 7017,
    title,
    completed: false,
  };

  return todo;
};
