import { TodoStatus, Todo } from '../types';

export function getFilteredTodos(
  category: TodoStatus,
  todoItems: Todo[],
) {
  let preparedItems: Todo[] = todoItems;

  if (category !== TodoStatus.All) {
    preparedItems = preparedItems
      .filter(({ completed }) => {
        switch (category) {
          case TodoStatus.Active:
            return !completed;
          default:
            return completed;
        }
      });
  }

  return preparedItems;
}
