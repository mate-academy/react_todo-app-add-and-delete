import { FilterTypes } from '../enum/FilterTypes';
import { Todo } from '../types/Todo';

export const getFilteredData = (arrList: Todo[], condition: FilterTypes) => {
  return arrList.filter(item => {
    switch (condition) {
      case FilterTypes.Active:
        return !item.completed;
      case FilterTypes.Completed:
        return item.completed;
      default:
        return true;
    }
  });
};
