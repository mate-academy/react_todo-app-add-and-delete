import React from 'react';

import { FilterOptions } from '../../types/FilterOptions';
import { Filter } from '../Filter/Filter';

type Props = {
  counter: number;
  filterOption: FilterOptions;
  onFilter: (value: FilterOptions) => void;
  isClearButtonShowing: boolean;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  counter,
  filterOption,
  onFilter,
  isClearButtonShowing,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counter} items left
      </span>

      <Filter filterOption={filterOption} onFilter={onFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isClearButtonShowing}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
