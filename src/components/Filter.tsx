import React from 'react';
import { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from './TodoContext';
import { FilterAction } from '../types/Actions';
// import { deleteTodo } from '../api/todos';

export const Filter: React.FC = () => {
  const { todos, filter, setFilter, deleteTodo } = useContext(TodoContext);
  const handleFilterChange = (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: FilterAction,
  ) => {
    event.preventDefault();
    setFilter(type);
  };

  const hasCompleteTodo = todos.filter(todo => todo.completed === true);

  const showTodos = todos.filter(todo => !todo.completed).length;

  const handleDeletCompleteTodos = () => {
    for (const item of hasCompleteTodo) {
      deleteTodo(item.id);
    }
  };

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {showTodos} items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={cn('filter__link', {
                selected: filter === FilterAction.All,
              })}
              data-cy="FilterLinkAll"
              onClick={event => {
                handleFilterChange(event, FilterAction.All);
              }}
            >
              All
            </a>

            <a
              href="#/active"
              className={cn('filter__link', {
                selected: filter === FilterAction.Active,
              })}
              data-cy="FilterLinkActive"
              onClick={event => {
                handleFilterChange(event, FilterAction.Active);
              }}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={cn('filter__link', {
                selected: filter === FilterAction.Completed,
              })}
              data-cy="FilterLinkCompleted"
              onClick={event => {
                handleFilterChange(event, FilterAction.Completed);
              }}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={!hasCompleteTodo.length}
            onClick={handleDeletCompleteTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
