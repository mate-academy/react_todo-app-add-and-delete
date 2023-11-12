import React, { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';

import { DispatchContext, StateContext } from '../states/Global';
import { FilterBy } from '../types/FilterBy';
import { deleteTodo } from '../api/todos';
import { ActionType } from '../states/Reducer';
import { ErrorType } from '../types/ErrorType';

interface Props {
  selectedFilter: FilterBy,
  onFilterSelected: (value: FilterBy) => void,
}

export const TodoFooter: React.FC<Props> = React.memo(({
  selectedFilter,
  onFilterSelected,
}) => {
  const { userId, todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed),
    [todos],
  );

  const getActiveCount = useCallback(() => {
    return todos.reduce((acc, todo) => {
      return !todo.completed ? acc + 1 : acc;
    }, 0);
  }, [todos]);

  const deleteCompleted = () => {
    const requests = completedTodos.map(({ id: todoId }) => {
      return deleteTodo(userId, todoId)
        .then(() => {
          dispatch({
            type: ActionType.DeleteTodo,
            payload: { id: todoId },
          });
        });
    });

    Promise.allSettled(requests)
      .catch(() => {
        dispatch({
          type: ActionType.ToggleError,
          payload: { errorType: ErrorType.DeleteError },
        });
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${getActiveCount()} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === FilterBy.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterSelected(FilterBy.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === FilterBy.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterSelected(FilterBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === FilterBy.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterSelected(FilterBy.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompleted}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
});
