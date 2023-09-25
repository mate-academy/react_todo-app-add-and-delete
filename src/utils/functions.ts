import { Status, Todo } from '../types/Todo';

export function getFilteredTodos(todosList: Todo[], filterBy: Status) {
  const filteredTodos = todosList.filter((todo: Todo) => {
    switch (filterBy) {
      case Status.Active:
        return todo.completed === false;

      case Status.Completed:
        return todo.completed === true;

      default:
        return todosList;
    }
  });

  return filteredTodos;
}
