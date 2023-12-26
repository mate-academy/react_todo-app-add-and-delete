import { FilterBy } from '../types/Filter';
import { Todo } from '../types/Todo';

export const filterTodo = (todos: Todo[], filterBy: FilterBy) => {
  switch (filterBy) {
    case FilterBy.Active: return todos.filter(todo => !todo.completed);
    case FilterBy.Completed: return todos.filter(todo => todo.completed);
    default: return todos;
  }
};
