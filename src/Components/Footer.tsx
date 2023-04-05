import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filters } from '../types/enums';

interface FooterPropsType {
  todosToShow: Todo[],
  selectedStatus: string,
  setSelectedStatus: (selectedStatus: Filters) => void,
}

export const Footer: React.FC<FooterPropsType> = ({
  todosToShow,
  selectedStatus,
  setSelectedStatus,
}) => {
  const todoLeft = todosToShow.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todoLeft} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Filters.all },
          )}
          onClick={() => setSelectedStatus(Filters.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Filters.active },
          )}
          onClick={() => setSelectedStatus(Filters.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Filters.completed },
          )}
          onClick={() => setSelectedStatus(Filters.completed)}
        >
          Completed
        </a>
      </nav>
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
