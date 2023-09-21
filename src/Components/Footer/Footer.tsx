import React, { useContext } from 'react';
import cn from 'classnames';

import { FiltersType } from '../../types/filterTypes';
import { TodosContext, ApiErrorContext } from '../../Context';
import { deleteTodo } from '../../api/todos';
import {
  deleteTodoAction,
  setIsDeletingAction,
  removeIsDeletingAction,
} from '../../Context/actions/actionCreators';

import { getActiveTodos, getCompletedTodos } from '../../helpers/getTodos';

export const Footer: React.FC = () => {
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
        });
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosNumber} items left`}
      </span>

      <nav className="filter">
        {(Object.entries(FiltersType))
          .map(([key, value]) => {
            const url = value === FiltersType.ALL
              ? ''
              : value.toLowerCase();

            return (
              <a
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
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': isClearCompletedInvisible,
        })}
        onClick={handleClearCompletedClick}
      >
        Clear completed
      </button>

    </footer>
  );
};
