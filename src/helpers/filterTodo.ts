import { SORT } from '../types/SortEnum';
import { Todo } from '../types/Todo';

export const filterTodo = (todos: Todo[], filterField: SORT): Todo[] => {
  let copyTodo = [...todos];

  copyTodo = copyTodo.filter((todo) => {
    switch (filterField) {
      case SORT.ACTIVE:
        return !todo.completed;
      case SORT.COMPLETED:
        return todo.completed;
      default:
        return copyTodo;
    }
  });

  return copyTodo;
};
