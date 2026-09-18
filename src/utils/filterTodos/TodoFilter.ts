import { Todo } from '../../types/Todo';
import { TodoFilterStatus } from '../../types/TodoFilterStatus';
import { CollBeakFilter } from './CollBeakFilter';

export class TodoFilter {
  public static Filter(
    todos: Todo[],
    ...predicates: ((todo: Todo) => boolean)[]
  ): Todo[] {
    return CollBeakFilter.Filter<Todo>(todos, predicates);
  }

  public static FilterByComplit(todoFilterState: TodoFilterStatus) {
    return ({ completed }: Todo) => {
      switch (todoFilterState) {
        case TodoFilterStatus.All:
          return true;
        case TodoFilterStatus.Active:
          return completed === false;
        case TodoFilterStatus.Completed:
          return completed === true;
      }
    };
  }
}
