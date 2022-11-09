/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import cn from 'classnames';
import { TodosFilter } from '../../types/TodosFilter';

type Props = {
  numberOfActive: number;
  numberOfCompeleted: number;
  handleFilter: (filter: TodosFilter) => void;
  filterBy: TodosFilter;
  deleteAllCompleted: () => Promise<void>;
};

export const Footer: FC<Props> = ({
  numberOfActive,
  handleFilter,
  filterBy,
  deleteAllCompleted,
  numberOfCompeleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${numberOfActive} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
          'filter__link',
          {
            selected: filterBy === TodosFilter.None,
          },
        )}
        onClick={() => handleFilter(TodosFilter.None)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn(
          'filter__link',
          {
            selected: filterBy === TodosFilter.Active,
          },
        )}
        onClick={() => handleFilter(TodosFilter.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn(
          'filter__link',
          {
            selected: filterBy === TodosFilter.Completed,
          },
        )}
        onClick={() => handleFilter(TodosFilter.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className={cn('todoapp__clear-completed', {
        hidden: numberOfCompeleted === 0,
      })}
      onClick={deleteAllCompleted}
    >
      Clear completed
    </button>
  </footer>
);
