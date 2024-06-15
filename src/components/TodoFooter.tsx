import React, { useContext, useCallback } from 'react';
import classNames from 'classnames';

import { deleteTodo } from '../api/todos';
import { TodoContext } from './TodoContext';
import { TodoStatus } from '../types/TodoStatus';
import { TodoErrors } from '../types/TodoErrors';

export const TodoFooter: React.FC = () => {
  const { state, dispatch } = useContext(TodoContext);

  const hasCompletedTodos = state.todos.some(todo => todo.completed);
  const activeTodoCount = state.todos.filter(todo => !todo.completed).length;

  const handleFilterClick = useCallback(
    (status: TodoStatus) => (event: React.MouseEvent) => {
      event.preventDefault();
      dispatch({ type: 'SET_FILTER', filter: status });
    },
    [dispatch],
  );

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = state.todos.filter(todo => todo.completed);

    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);

        dispatch({ type: 'DELETE_TODO', id: todo.id });
      } catch {
        dispatch({ type: 'SET_ERROR', error: TodoErrors.DELETE_TODO });
      }
    }
  }, [state.todos, dispatch]);

  if (state.todos.length === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodoCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatus).map(status => (
          <a
            key={status}
            href={
              status !== TodoStatus.All ? `#/${status.toLowerCase()}` : '#/'
            }
            className={classNames('filter__link', {
              selected: state.filter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={handleFilterClick(status)}
          >
            {status}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'todoapp__clear-completed--active': hasCompletedTodos,
        })}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
