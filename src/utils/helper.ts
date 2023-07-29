import { Todo } from '../types/Todo';
import { FilterType } from '../types/enum';

export function getPreperadTodos(
  todos: Todo[] | null,
  filterBy: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const visibleTodos = [...todos!];

  switch (filterBy) {
    case FilterType.All:
      return visibleTodos;

    case FilterType.Completed:
      return visibleTodos.filter(todo => todo.completed);

    case FilterType.Active:
      return visibleTodos.filter(todo => !todo.completed);

    default:
      return visibleTodos;
  }
}
