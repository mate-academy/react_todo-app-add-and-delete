import { Options } from '../types/Options';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], option: Options) => {
  switch (option) {
    case Options.Active:
      return todos.filter(todo => !todo.completed);

    case Options.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
