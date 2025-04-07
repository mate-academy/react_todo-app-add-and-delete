import { Todo } from '../types/Todo';

export enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const filter = (todos: Todo[], filterType: FilterType) => {
  const res = [...todos];

  switch (filterType) {
    case FilterType.ALL:
      return res;
    case FilterType.ACTIVE:
      return res.filter(todo => !todo.completed);
    case FilterType.COMPLETED:
      return res.filter(todo => todo.completed);
  }
};
