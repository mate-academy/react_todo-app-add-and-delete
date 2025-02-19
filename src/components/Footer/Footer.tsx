import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[];
  filter: string;
  setFilter: (value: Filter) => void;
  handleClearCompleted: () => void;
};
export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  const buttonDisable = todos.some(todo => todo.completed);
  const todosLength = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLength} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterType => {
          return (
            <a
              key={filterType}
              href={`#/${filterType === Filter.all ? '' : filterType}`}
              className={classNames(
                'filter__link',
                filter === filterType && 'selected',
              )}
              data-cy={`FilterLink${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
              onClick={() => setFilter(filterType)}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!buttonDisable}
      >
        Clear completed
      </button>
    </footer>
  );
};
