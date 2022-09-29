import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/FilterTypeEnum';
import { Todo } from '../../types/Todo';

type Props = {
  handleChooseFilter: (filter: FilterType) => void;
  todos: Todo[];
  filterType: FilterType;
};

export const Footer: React.FC<Props> = ({
  handleChooseFilter,
  todos,
  filterType,
}) => {
  const activeTodos = todos.filter(({ completed }) => !completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => handleChooseFilter(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className="filter__link"
          onClick={() => handleChooseFilter(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className="filter__link"
          onClick={() => handleChooseFilter(FilterType.Completed)}
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
