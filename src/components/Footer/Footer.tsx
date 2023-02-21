import React, { useState } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filterTodos: (type: Filter) => void;
  countOfActiveTodos: number;
  completedTodoLength: number;
  removeAllCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  filterTodos,
  countOfActiveTodos,
  completedTodoLength,
  removeAllCompletedTodos,
}) => {
  const [isFilterSelected, setIsFilterSelected] = useState(Filter.All);

  return (
    <>
      {/* Hide the footer if there are no todos */}
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${countOfActiveTodos} items left`}
        </span>

        {/* Active filter should have a 'selected' class */}
        <nav className="filter">
          <a
            href="#/"
            className={cn(
              'filter__link',
              // eslint-disable-next-line
              { 'selected': isFilterSelected === Filter.All },
            )}
            onClick={() => {
              filterTodos(Filter.All);
              setIsFilterSelected(Filter.All);
            }}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn(
              'filter__link',
              // eslint-disable-next-line
              { 'selected': isFilterSelected === Filter.Active },
            )}
            onClick={() => {
              filterTodos(Filter.Active);
              setIsFilterSelected(Filter.Active);
            }}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn(
              'filter__link',
              // eslint-disable-next-line
              { 'selected': isFilterSelected === Filter.Completed },
            )}
            onClick={() => {
              filterTodos(Filter.Completed);
              setIsFilterSelected(Filter.Completed);
            }}
          >
            Completed
          </a>
        </nav>

        {/* don't show this button if there are no completed todos */}
        <button
          type="button"
          className={cn('todoapp__clear-completed', {
            'todoapp__clear-completed--novisible': !completedTodoLength,
          })}
          onClick={removeAllCompletedTodos}
          disabled={!completedTodoLength}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
});
