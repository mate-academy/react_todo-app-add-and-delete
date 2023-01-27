import React, { memo } from 'react';
import { FilterType } from '../../types/Filter';
import { Filter } from '../Filter/Filter';

type Props = {
  filterType: string;
  activeTodosAmount: number;
  isTodoCompleted: boolean;
  cleanCompletedTodos: () => void;
  onChangeFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
};

export const Footer: React.FC<Props> = memo((props) => {
  const {
    filterType,
    activeTodosAmount,
    isTodoCompleted,
    onChangeFilterType,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosAmount} items left`}
      </span>

      <Filter
        filterType={filterType}
        setFilterType={onChangeFilterType}
      />

      {isTodoCompleted && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
