import React from 'react';

import { FilterType } from '../../types/FilterType';
import { TodoFilter } from '../TodoFilter';

type Props = {
  uncompletedTodosCount: number;
  filter: FilterType;
  handleFilter: (newFilter: FilterType) => void;
  handleClearCompletedTodos: () => void;
  hasCompletedTodos: boolean;
};

export const Footer: React.FC<Props> = ({
  uncompletedTodosCount,
  filter,
  handleFilter,
  handleClearCompletedTodos,
  hasCompletedTodos,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {uncompletedTodosCount} items left
    </span>

    <TodoFilter filter={filter} handleFilter={handleFilter} />

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompletedTodos}
      onClick={handleClearCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
