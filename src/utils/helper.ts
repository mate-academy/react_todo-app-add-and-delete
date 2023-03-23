import { ErrorTypes } from '../types/ErrorTypes';
import { FilterCases } from '../types/FilterCases';
import { Todo } from '../types/Todo';

export const filterByStatus = (
  todos: Todo[],
  filter: FilterCases,
) => {
  switch (filter) {
    case FilterCases.Active:
      return todos.filter(({ completed }) => !completed);

    case FilterCases.Completed:
      return todos.filter(({ completed }) => completed);

    default:
      return todos;
  }
};

export const getLinkText = (filter: FilterCases) => {
  switch (filter) {
    case FilterCases.All:
      return 'All';

    case FilterCases.Active:
      return 'Active';

    case FilterCases.Completed:
      return 'Completed';

    default:
      return 'All';
  }
};

type GenerateErrorParams = (
  erroType: ErrorTypes,
  setNewError: (newError: ErrorTypes) => void
) => void;

export const generateError: GenerateErrorParams = (errorType, setNewError) => {
  setNewError(errorType);

  const timer = setTimeout(() => {
    setNewError(ErrorTypes.None);
    clearTimeout(timer);
  }, 3000);
};
