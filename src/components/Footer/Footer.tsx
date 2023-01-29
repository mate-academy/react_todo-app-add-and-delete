import React, { memo } from 'react';
import { FilterType } from '../../types/FilterType';
import { Filter } from '../Filter/Filter';

type Props = {
  activeTodos: number;
  filterType: FilterType;
  selectFilterType: (filterType: FilterType) => void;
  removeCompletedTodos: () => void;
  completedTodos: number
};

export const Footer: React.FC<Props> = memo(({
  activeTodos,
  filterType,
  selectFilterType,
  removeCompletedTodos,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <Filter filterType={filterType} selectFilterType={selectFilterType} />

      {completedTodos > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={removeCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
