import React, { useContext } from 'react';
import cn from 'classnames';

import { FiltersType } from '../../types/filterTypes';
import { TodosContext, ApiErrorContext, FormFocusContext } from '../../Context';
import { deleteTodo } from '../../api/todos';
import {
  deleteTodoAction,
  setIsDeletingAction,
  removeIsDeletingAction,
} from '../../Context/actions/actionCreators';

import { getActiveTodos, getCompletedTodos } from '../../helpers/getTodos';

export const Footer: React.FC = () => {
  const { setIsFocused } = useContext(FormFocusContext);
  const {
    todos,
    filter,
    setFilter,
    dispatch,
  } = useContext(TodosContext);
  const { setApiError } = useContext(ApiErrorContext);

  const activeTodosNumber = getActiveTodos(todos).length;
  const completedTodos = getCompletedTodos(todos);
  const isClearCompletedInvisible = completedTodos.length === 0;

  const handleClearCompletedClick = () => {
    setIsFocused(false);

    completedTodos.forEach(({ id }) => {
      const isDeletingAction = setIsDeletingAction(id);

      dispatch(isDeletingAction);
      deleteTodo(id)
        .then(() => {
          const deleteAction = deleteTodoAction(id);

          dispatch(deleteAction);
        })
        .catch((error) => {
          const removeAction = removeIsDeletingAction(id);

          dispatch(removeAction);
          setApiError(error);
        })
        .finally(() => {
          setIsFocused(true);
        });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosNumber} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {(Object.entries(FiltersType))
          .map(([key, value]) => {
            const url = value === FiltersType.ALL
              ? ''
              : value.toLowerCase();

            return (
              <a
                data-cy={`FilterLink${value}`}
                href={`#/${url}`}
                key={key}
                className={cn('filter__link', {
                  selected: filter === value,
                })}
                onClick={() => setFilter(value)}
              >
                {value}
              </a>
            );
          })}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': isClearCompletedInvisible,
        })}
        onClick={handleClearCompletedClick}
        disabled={isClearCompletedInvisible}
      >
        Clear completed
      </button>

    </footer>
  );
};
