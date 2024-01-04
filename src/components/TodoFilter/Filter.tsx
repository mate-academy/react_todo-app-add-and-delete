import { FilterBy } from '../../types/Filter';
import { Todo } from '../../types/Todo';

export const filterTodo = (todos: Todo[], filter: FilterBy) => {
  switch (filter) {
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
