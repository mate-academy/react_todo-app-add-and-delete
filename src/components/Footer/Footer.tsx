import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterType: FilterType,
  handleFilterType: (filter: FilterType) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  handleFilterType,
}) => {
  const todosLeft = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeft} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterType.All,
            },
          )}
          onClick={() => handleFilterType(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterType.Active,
            },
          )}
          onClick={() => handleFilterType(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterType === FilterType.Completed,
            },
          )}
          onClick={() => handleFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
