import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export const applyFilterToTodos = (
  taskList: Todo[],
  selectedFilter: Filter,
): Todo[] => {
  const filterMethods = {
    [Filter.Active]: (tasks: Todo[]) => tasks.filter(task => !task.completed),
    [Filter.Completed]: (tasks: Todo[]) => tasks.filter(task => task.completed),
    [Filter.All]: (tasks: Todo[]) => tasks,
  };

  return (filterMethods[selectedFilter] || filterMethods[Filter.All])(taskList);
};
