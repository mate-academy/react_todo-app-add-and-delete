import { Todo, States } from './types/Todo';

export const getFilteredTodos = (
  renderedTodos: Todo[],
  selectOption: string,
): Todo[] => {
  switch (selectOption) {
    case States.Completed:
      return renderedTodos.filter(todo => todo.completed);
      break;
    case States.Active:
      return renderedTodos.filter(todo => !todo.completed);
      break;
    default:
      return renderedTodos;
  }
};
