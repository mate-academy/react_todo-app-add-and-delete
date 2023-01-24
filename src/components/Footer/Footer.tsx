import { FC, memo, useContext } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { TodosLength } from '../../TodosLength';

interface Props {
  onSelectFilter: (value: Filter) => void
  filterType: Filter;
}

export const Footer: FC<Props> = memo(
  ({ onSelectFilter, filterType: filter }) => {
    const handleClickFilter = (filterType: Filter) => {
      onSelectFilter(filterType);
    };

    const todosLength = useContext(TodosLength);

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${todosLength} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            data-cy="FilterLinkAll"
            href="#/"
            className={cn(
              'filter__link',
              { selected: filter === Filter.ALL },
            )}
            onClick={() => handleClickFilter(Filter.ALL)}
          >
            All
          </a>

          <a
            data-cy="FilterLinkActive"
            href="#/active"
            className={cn(
              'filter__link',
              { selected: filter === Filter.ACTIVE },
            )}
            onClick={() => handleClickFilter(Filter.ACTIVE)}
          >
            Active
          </a>
          <a
            data-cy="FilterLinkCompleted"
            href="#/completed"
            className={cn(
              'filter__link',
              { selected: filter === Filter.COMPLITED },
            )}
            onClick={() => handleClickFilter(Filter.COMPLITED)}
          >
            Completed
          </a>
        </nav>

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => handleClickFilter(Filter.ALL)}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
