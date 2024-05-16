import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';

enum Selected {
  'all',
  'active',
  'completed',
}

export const Footer: React.FC = () => {
  const {
    todos,
    setSelectedFilter,
    showFilteredTodos,
    selectedFilter,
    deleteCompleted,
  } = useContext(TodosContext);

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {showFilteredTodos(Selected.active).length} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              data-cy="FilterLinkAll"
              className={classNames('filter__link', {
                selected: selectedFilter === Selected.all,
              })}
              onClick={() => setSelectedFilter(Selected.all)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: selectedFilter === Selected.active,
              })}
              onClick={() => setSelectedFilter(Selected.active)}
              data-cy="FilterLinkActive"
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: selectedFilter === Selected.completed,
              })}
              onClick={() => {
                setSelectedFilter(Selected.completed);
              }}
              data-cy="FilterLinkCompleted"
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={deleteCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
