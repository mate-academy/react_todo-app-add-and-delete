import classNames from 'classnames';
import { Filter } from '../types/Filter';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filter: Filter;
  onFilterChange: (value: Filter) => void;
  onClear: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClear,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {[Filter.ALL, Filter.ACTIVE, Filter.COMPLETED].map(value => (
          <a
            key={value}
            href={`#/${value}`}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => onFilterChange(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
