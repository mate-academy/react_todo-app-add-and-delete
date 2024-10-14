import { Todo } from '../../types/Todo';
import { Filter } from '../../FilterEnum';

export const filterTodos = (todos: Todo[], filterBy: Filter): Todo[] => {
  switch (filterBy) {
    case Filter.Completed:
      return todos.filter(todo => todo.completed);
    case Filter.Active:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};
