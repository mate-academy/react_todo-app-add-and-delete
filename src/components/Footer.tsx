import React from 'react';
import { FILTERS } from '../types/Filters';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  filter: FILTERS;
  onFilter: (filter: FILTERS) => void;
  todos: Todo[];
  onDeleteAllComleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  onFilter,
  todos,
  onDeleteAllComleted,
}) => {
  const filterOptions = Object.values(FILTERS);
  const isNotDisabled = todos.some(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(filterOption => (
          <a
            key={filterOption}
            href="#/"
            className={classNames('filter__link', {
              selected: filter === filterOption,
            })}
            data-cy={`FilterLink${filterOption}`}
            onClick={() => onFilter(filterOption)}
          >
            {filterOption}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isNotDisabled}
        onClick={onDeleteAllComleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
