import React from 'react';
import classNames from 'classnames';
import { countTodos } from '../../utils/countTodos';
import { Filters } from '../../utils/Filters';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterParam: string,
  onFilterChange: (newFilter:Filters) => void,
  clearCompleted: () => void,
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  filterParam,
  onFilterChange,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countTodos(todos, false)} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {(Object.keys(Filters) as Array<keyof typeof Filters>)
          .map((key) => (
            <a
              href={key === 'All'
                ? '#/'
                : `#/${Filters[key][0].toLowerCase() + Filters[key].slice(1)}`}
              className={classNames(
                'filter__link',
                { selected: filterParam === Filters[key] },
              )}
              key={key}
              onClick={() => onFilterChange(Filters[key])}
            >
              {Filters[key]}
            </a>
          ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={countTodos(todos, true).length === 0}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
