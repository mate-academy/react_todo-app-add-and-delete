import { Todo, TodoStatus } from '../types/Todo';

type FilterProps = {
  todos: Todo[];
  selectedFilter: TodoStatus;
};

export function getFilteredTodos({ todos, selectedFilter }: FilterProps) {
  switch (selectedFilter) {
    case TodoStatus.All:
      return todos;
    case TodoStatus.Active:
      return todos.filter(todo => todo.completed === false);
    case TodoStatus.Completed:
      return todos.filter(todo => todo.completed === true);
    default:
      return todos;
  }
}
