import { SelectType } from '../enums';
import { Todo } from '../types/Todo';

export const selectTodos = (todos: Todo[], select: SelectType) => {
  const preperedTodos = [...todos];

  if (select) {
    switch (select) {
      case SelectType.All:
        return preperedTodos;
      case SelectType.Active:
        return preperedTodos.filter(todo => !todo.completed);
      case SelectType.Completed:
        return preperedTodos.filter(todo => todo.completed);
      default:
        return preperedTodos;
    }
  }

  return preperedTodos;
};
