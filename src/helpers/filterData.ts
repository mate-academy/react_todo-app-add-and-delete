import { Todo } from '../types/Todo';
import { FilterOptions } from '../types/enums';

export const filterData = (data: Todo[], filter: string) => {
  switch (filter) {
    case FilterOptions.All:
      return data;
    case FilterOptions.Active:
      const completedFalse = data.filter(x => x.completed === false);

      return completedFalse;
    case FilterOptions.Completed:
      const completedTrue = data.filter(x => x.completed === true);

      return completedTrue;
    default:
      return data;
  }
};
