import { FilterBy } from '../components/TodosFooter';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterBy: FilterBy) => {
  switch (filterBy) {
    case 'active':
      return todos.filter(({ completed }) => !completed);

    case 'completed':
      return todos.filter(({ completed }) => completed);

    default:
      return todos;
  }
};
