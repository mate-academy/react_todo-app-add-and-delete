import React, { useCallback, useContext } from 'react';

import cn from 'classnames';

import { FilterStatus } from '../types/FilterStatus';
import { deleteTodo } from '../api/todos';
import { useErrorMessage } from './useErrorMessage';

import { StateContext, DispatchContext } from '../store/TodoContext';
import {
  setFilterAction,
  deleteTodoAction,
  setCurrentlyLoadingItemsIdsAction,
  setInputFocuseAction,
} from './todoActions';

export const Footer: React.FC = () => {
  const { todos, filterStatus, currentlyLoadingItemsIds } =
    useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleError = useErrorMessage();

  const completedTodosIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const activeTodos = todos.filter(todo => !todo.completed);

  const onFilterChange = useCallback(
    (filter: FilterStatus) => {
      dispatch(setFilterAction(filter));
    },
    [dispatch],
  );

  function handleDeleteTodo(todoId: number) {
    deleteTodo(todoId)
      .then(() => {
        dispatch(deleteTodoAction(todoId));
        dispatch(
          setCurrentlyLoadingItemsIdsAction([
            ...currentlyLoadingItemsIds.filter(id => id !== todoId),
          ]),
        );
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      });
  }

  function handleClearCompleted() {
    dispatch(setCurrentlyLoadingItemsIdsAction(completedTodosIds));

    const deleteTodoPromises = completedTodosIds.map(todoId =>
      handleDeleteTodo(todoId),
    );

    Promise.all(deleteTodoPromises)
      .then(() => {
        dispatch(setInputFocuseAction(true));
      })
      .catch(() => {
        handleError('Unable to delete completed todos');
        dispatch(setInputFocuseAction(true));

        dispatch(setCurrentlyLoadingItemsIdsAction([]));
      });
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {todos.length > 0 && (
        <span className="todo-count" data-cy="TodosCounter">
          {`${activeTodos.length} items left`}
        </span>
      )}

      <nav className="filter" data-cy="Filter">
        <a
          href="/#"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={completedTodosIds.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
