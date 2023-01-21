import { FC, memo } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

interface Props {
  length: number;
  onFilter: (str: Filter) => void;
  filter: Filter;
  deleteCompleted: () => void;
}

export const Footer: FC<Props> = memo(({
  length,
  onFilter,
  filter,
  deleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', { selected: filter === Filter.all })}
          onClick={() => onFilter(Filter.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', { selected: filter === Filter.active })}
          onClick={() => onFilter(Filter.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === Filter.completed })}
          onClick={() => onFilter(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => deleteCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
});
