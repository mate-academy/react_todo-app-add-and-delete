import { ErrorType } from './types/ErorTypes';
import { Todo } from './types/Todo';

export enum FilteredBy {
  DefaultType = '',
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export function filteredTodoList(
  todos: Todo[],
  filterBy: FilteredBy,
) {
  const filteredTodos = [...todos];

  switch (filterBy) {
    case FilteredBy.Active:
      return filteredTodos.filter(todo => !todo.completed);
    case FilteredBy.Completed:
      return filteredTodos.filter(todo => todo.completed);
    case FilteredBy.All:
    default:
      return filteredTodos;
  }
}

export const getErrorMessage = (error: ErrorType | null) => {
  switch (error) {
    case ErrorType.LoadError:
      return 'Unable to load todos';

    case ErrorType.TitleError:
      return 'Title should not be empty';

    case ErrorType.AddError:
      return 'Unable to add a todo';

    case ErrorType.DeleteError:
      return 'Unable to delete a todo';

    case ErrorType.UpdateError:
      return 'Unable to update a todo';

    default:
      return null;
  }
};
