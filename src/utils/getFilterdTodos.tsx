import { SelectedType } from '../types/SelectedType';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (
  todos: Todo[],
  selectedOption: SelectedType,
) => {
  switch (selectedOption) {
    case SelectedType.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case SelectedType.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
