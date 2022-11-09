import React from 'react';
import { Todo } from '../../../types/Todo';
import { FilterType } from '../../../utils/enums/FilterType';
import { Navigation } from '../Navigation';

type Props = {
  filterType: FilterType;
  todos: Todo[];
  onFilter: (filterType: FilterType) => void;
};

export const Footer: React.FC<Props> = ({ filterType, todos, onFilter }) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${todos.length} items left`}
    </span>

    <Navigation filterType={filterType} onFilter={onFilter} />

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
    >
      Clear completed
    </button>
  </footer>
);
