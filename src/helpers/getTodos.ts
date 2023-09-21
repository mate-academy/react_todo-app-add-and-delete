import { FiltersType } from '../types/filterTypes';
import { TodosListType } from '../types/todosTypes';

export const getCompletedTodos
  = (todos: TodosListType) => todos.filter(({ completed }) => completed);

export const getActiveTodos
  = (todos: TodosListType) => todos.filter(({ completed }) => !completed);

const getFilteredTodos
  = (todos: TodosListType, filter: FiltersType): TodosListType => {
    switch (filter) {
      case FiltersType.ALL:
        return todos;

      case FiltersType.ACTIVE:
        return getActiveTodos(todos);

      case FiltersType.COMPLETED:
        return getCompletedTodos(todos);

      default:
        return todos;
    }
  };

export default getFilteredTodos;
