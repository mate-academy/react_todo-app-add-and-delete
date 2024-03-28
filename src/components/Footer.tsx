import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FILTERS } from '../utils/constants';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  activeFilter: Filter;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeFilter,
  clearCompleted,
}) => {
  const todosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ hash, name }) => (
          <a
            href={`/${hash}`}
            className={classNames('filter__link', {
              selected: activeFilter.name === name,
            })}
            data-cy={`FilterLink${name}`}
            key={hash}
          >
            {name}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.length === todosCount}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
