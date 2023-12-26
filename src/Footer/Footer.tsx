import cn from 'classnames';
import { memo } from 'react';
import { Filter } from '../types/Selected-filter-enum';

interface Props {
  filterType: Filter,
  onHandleFilterType: (type: Filter) => void,
  uncompletedCount: number,
  onClearCompleted: () => void,
  hasCompleted: boolean,
}

export const Footer: React.FC<Props> = memo(({
  filterType,
  onHandleFilterType,
  uncompletedCount,
  onClearCompleted,
  hasCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${uncompletedCount} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <button
        type="button"
        className={cn('filter__link', {
          selected: filterType === Filter.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onHandleFilterType(Filter.all)}
      >
        {Filter.all}
      </button>

      <button
        type="button"
        className={cn('filter__link', {
          selected: filterType === Filter.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onHandleFilterType(Filter.active)}
      >
        {Filter.active}
      </button>

      <button
        type="button"
        className={cn('filter__link', {
          selected: filterType === Filter.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onHandleFilterType(Filter.completed)}
      >
        {Filter.completed}
      </button>
    </nav>

    {hasCompleted
      && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
  </footer>
));
