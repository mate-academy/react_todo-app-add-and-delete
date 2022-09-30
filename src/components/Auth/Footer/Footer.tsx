import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../../types/FilterBy';
import { Todo } from '../../../types/Todo';

type Props = {
  filterTypes: (arg: FilterType) => void;
  filterType: FilterType | string,
  todos: Todo[],

};

export const Footer: React.FC<Props> = ({
  filterTypes,
  filterType,
  todos,
}) => {
  const notCompleted = todos.filter(({ completed }) => !completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${notCompleted.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === 'All' },
          )}
          onClick={() => {
            filterTypes(FilterType.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === 'Active' },
          )}
          onClick={() => filterTypes(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === 'Completed' },
          )}
          onClick={() => filterTypes(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
