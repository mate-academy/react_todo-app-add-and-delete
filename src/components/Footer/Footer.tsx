import React from 'react';
import { Filter } from '../Filter/Filter';
import { SortType } from '../../types/sortField';

type Props = {
  count: number;
  onDelete: () => void;
  isDisabled: boolean;
  sortField: SortType;
  onFilter: (field: SortType) => void;
};

export const Footer: React.FC<Props> = ({
  count,
  sortField,
  isDisabled,
  onDelete,
  onFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count} items left
      </span>

      <Filter sortField={sortField} onFilter={onFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDisabled}
        onClick={onDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
