import React from 'react';
import classNames from 'classnames';

type Props = {
  counterActiveTodos:number,
  typeFilter:string,
  onTypeFilter: (type: string) => void,
  hasComplitedTodo: boolean,
  clearCompletedTodo: () => void,
};

export const Footer:React.FC<Props> = React.memo(({
  counterActiveTodos,
  typeFilter,
  onTypeFilter,
  hasComplitedTodo,
  clearCompletedTodo,
}) => {
  const selectTypeFiltred = (type:string) => {
    onTypeFilter(type);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${counterActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={
            classNames('filter__link', {
              'filter__link selected': typeFilter === 'All',
            })
          }
          onClick={() => selectTypeFiltred('All')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={
            classNames('filter__link', {
              'filter__link selected': typeFilter === 'Active',
            })
          }
          onClick={() => selectTypeFiltred('Active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            classNames('filter__link', {
              'filter__link selected': typeFilter === 'Completed',
            })
          }
          onClick={() => selectTypeFiltred('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed hide', {
            hidden: !hasComplitedTodo,
          },
        )}
        onClick={clearCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
});
