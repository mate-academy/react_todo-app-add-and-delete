import React from 'react';
import classNames from 'classnames';

import { FilterParams } from '../../types/FilterParams';

import { UseTodosContext } from '../../utils/TodosContext';

type Props = {};

export const TodoFooter: React.FC<Props> = () => {
  const context = UseTodosContext();

  const {
    todos,
    filterParam,
    setFilterParam,
    setIsCompletedTodosCleared,
  } = context;

  const itemsLeft = todos.filter(({ completed }) => !completed).length;
  const isSomeTodoCompleted = todos.some(({ completed }) => completed);

  return (
    <footer data-cy="Footer" className="todoapp__footer">
      <span data-cy="TodosCounter" className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav data-cy="Filter" className="filter">
        {Object.values(FilterParams).map(value => (
          <a
            data-cy={`FilterLink${value}`}
            href={`#/${value}`}
            key={value}
            className={classNames('filter__link', {
              selected: value === filterParam,
            })}
            onClick={() => setFilterParam(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!isSomeTodoCompleted}
        onClick={() => setIsCompletedTodosCleared(true)}
      >
        Clear completed
      </button>
    </footer>
  );
};
