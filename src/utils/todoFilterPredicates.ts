import { Todo } from '../types/Todo';
import { TodoFilterEnum } from '../enums/TodoFilter';

type TodoPredicate = (todo: Todo) => boolean;

export const todoFilterPredicates: Record<TodoFilterEnum, TodoPredicate> = {
  [TodoFilterEnum.All]: () => true,

  [TodoFilterEnum.Active]: todo => !todo.completed,

  [TodoFilterEnum.Completed]: todo => todo.completed,
};
