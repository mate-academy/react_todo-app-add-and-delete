/* eslint-disable max-len */
import { useContext } from 'react';
import {
  DispatchContext,
  StateContext,
  FilterOfTodos,
} from '../../utils/Store';
import cn from 'classnames';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

export const Footer = () => {
  const { filterTodos } = useContext(StateContext);
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const completed = state.todos.filter(todo => todo.completed === true);

  const handleClearCompleted = async () => {
    for (const todo of completed) {
      dispatch({
        type: 'addToLoading',
        payload: { id: todo.id },
      });
    }

    const todoDeleteFail: Todo[] = [];
    const todoDeleteSuccess: Todo[] = [];

    for (const todo of completed) {
      try {
        await deleteTodo(todo.id);
        todoDeleteSuccess.push(todo);
      } catch (error) {
        todoDeleteFail.push(todo);
      }
    }

    for (const todo of todoDeleteSuccess) {
      dispatch({
        type: 'deleteTodo',
        payload: { id: todo.id },
      });
    }

    if (todoDeleteFail.length) {
      dispatch({
        type: 'setError',
        payload: 'Unable to delete todo',
      });
    }

    for (const todo of completed) {
      dispatch({
        type: 'removeFromLoading',
        payload: { id: todo.id },
      });
    }
  };

  const notCompleted = state.todos.filter(todo => todo.completed === false);

  if (state.todos.length === 0) {
    return null;
  }

  const hasCompletedTodos = state.todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompleted.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterTodos === FilterOfTodos.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() =>
            dispatch({ type: 'filterTodos', name: FilterOfTodos.All })
          }
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterTodos === FilterOfTodos.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() =>
            dispatch({ type: 'filterTodos', name: FilterOfTodos.Active })
          }
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterTodos === FilterOfTodos.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() =>
            dispatch({ type: 'filterTodos', name: FilterOfTodos.Completed })
          }
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
