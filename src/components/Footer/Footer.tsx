import { memo } from 'react';
import { FilterType } from '../../types/FilterType';
import { Filter } from '../Filter/Filter';

type Props = {
  activeTodosAmount: number;
  hasCompletedTodos: boolean;
  filterType: FilterType;
  setFilterType: (v: FilterType) => void;
  onDeleteCompleted: () => Promise<void>;
};

export const Footer: React.FC<Props> = memo((props) => {
  const {
    activeTodosAmount,
    hasCompletedTodos,
    filterType,
    setFilterType,
    onDeleteCompleted,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosAmount} item${activeTodosAmount > 1 ? 's' : ''} left`}
      </span>

      <Filter
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {hasCompletedTodos && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={onDeleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
