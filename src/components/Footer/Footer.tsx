import React, { memo } from 'react';
import { FilterType } from '../../types/FilterType';
import { Filter } from '../Filter/Filter';

type Props = {
  activeTodos: number;
  filterType: FilterType;
  selectFilterType: (filterType: FilterType) => void;
  removeCompletedTodos: () => void
};

export const Footer: React.FC<Props> = memo(({
  activeTodos,
  filterType,
  selectFilterType,
  removeCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <Filter filterType={filterType} selectFilterType={selectFilterType} />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
