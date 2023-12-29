import { FILTERS } from '../components/TodosFooter';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterBy: FILTERS) => {
  switch (filterBy) {
    case FILTERS.Active:
      return todos.filter(({ completed }) => !completed);

    case FILTERS.Completed:
      return todos.filter(({ completed }) => completed);

    default:
      return todos;
  }
};
