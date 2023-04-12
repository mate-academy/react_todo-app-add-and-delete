import { Todo } from '../../types/Todo';

export const filterTodos = (todos: Todo[], filterBy: string) => {
  if (todos) {
    switch (filterBy) {
      case 'Active':
        return todos.filter((todo) => !todo.completed);

      case 'Completed':
        return todos.filter((todo) => todo.completed);

      case 'All':
      default:
        return todos;
    }
  }

  return todos;
};
