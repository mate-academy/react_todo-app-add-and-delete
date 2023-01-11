import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/Filtertype';

type Props = {
  todoItemLeft: number;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  clearCompleted: () => void;
  complitedTodos: boolean;
};

export const Footer: React.FC<Props> = ({
  todoItemLeft,
  filterType,
  setFilterType,
  clearCompleted,
  complitedTodos,
}) => {
  const arrFilterType = [{
    data: 'FilterLinkAll',
    href: '#/',
    type: FilterType.all,
    text: 'All',
  }, {
    data: 'FilterLinkActive',
    href: '#/active',
    type: FilterType.active,
    text: 'Active',
  }, {
    data: 'FilterLinkCompleted',
    href: '#/completed',
    type: FilterType.completed,
    text: 'Completed',
  }];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todoItemLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {arrFilterType.map(filter => (
          <a
            key={filter.text}
            data-cy={filter.data}
            href={filter.href}
            className={classNames('filter__link',
              { selected: filter.type === filterType })}
            onClick={() => setFilterType(filter.type)}
          >
            {filter.text}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        disabled={complitedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
