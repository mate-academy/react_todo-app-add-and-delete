import React, { useCallback, useContext } from 'react';
import { deleteTodo } from '../../api/todos';
import { DispatchContext, StateContext } from '../../store/TodoContext';
import { ActionTypes, FilterFields } from '../../store/types';

export const Footer: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, filter } = useContext(StateContext);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const onChangeFilter = useCallback(
    (filterField: FilterFields) => {
      dispatch({ type: ActionTypes.SET_FILTER, payload: filterField });
    },
    [dispatch],
  );

  const clearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id)
          .then(() => {
            dispatch({ type: ActionTypes.DELETE_TODO, payload: todo.id });
          })
          .catch(() => {
            dispatch({
              type: ActionTypes.SET_ERROR,
              payload: 'Unable to delete a todo',
            });
          })
          .finally(() => {
            dispatch({ type: ActionTypes.SET_REFRESH });
          });
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          onClick={() => onChangeFilter(FilterFields.All)}
          href="#/"
          className={`filter__link ${filter === FilterFields.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          onClick={() => onChangeFilter(FilterFields.Active)}
          href="#/active"
          className={`filter__link ${filter === FilterFields.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          onClick={() => onChangeFilter(FilterFields.Completed)}
          href="#/completed"
          className={`filter__link ${filter === FilterFields.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
